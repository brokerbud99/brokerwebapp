'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload, X, CheckCircle, Clock } from 'lucide-react'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadComplete?: () => void
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
    const { profile } = useUserProfile()
    const [applications, setApplications] = useState<{ id: number; application_id: string; lead_first_name: string | null; lead_last_name: string | null }[]>([])
    const [selectedAppId, setSelectedAppId] = useState<string>('')
    const [isAdhoc, setIsAdhoc] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [loadingApps, setLoadingApps] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
    const [uploadType, setUploadType] = useState<string>('')

    const resetForm = () => {
        setFiles([])
        setSelectedAppId('')
        setIsAdhoc(false)
        setShowSuccess(false)
        setUploadedFiles([])
        setUploadType('')
    }

    const fetchApplications = useCallback(async () => {
        try {
            setLoadingApps(true)
            // Fetch applications with lead names
            const { data: appsData, error: appsError } = await supabase
                .from('application')
                .select('id, application_id, lead_id')
                .eq('company_code', profile?.company_code)
                .order('created_at', { ascending: false })

            if (appsError) throw appsError

            if (appsData && appsData.length > 0) {
                // Get unique lead IDs
                const leadIds = appsData.map(app => app.lead_id).filter(Boolean)

                // Fetch lead names
                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads')
                    .select('id, first_name, last_name')
                    .in('id', leadIds)

                if (leadsError) {
                    console.error('Error fetching leads:', leadsError)
                }

                // Map lead names to applications
                const leadsMap = new Map(leadsData?.map(lead => [String(lead.id), lead]) || [])
                const appsWithNames = appsData.map(app => ({
                    id: app.id,
                    application_id: app.application_id,
                    lead_first_name: leadsMap.get(app.lead_id)?.first_name || null,
                    lead_last_name: leadsMap.get(app.lead_id)?.last_name || null
                }))

                setApplications(appsWithNames)
            } else {
                setApplications([])
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoadingApps(false)
        }
    }, [profile?.company_code])

    useEffect(() => {
        if (isOpen) {
            resetForm()
            if (profile?.company_code) {
                fetchApplications()
            }
        }
    }, [isOpen, profile?.company_code, fetchApplications])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!profile || files.length === 0) return
        if (!isAdhoc && !selectedAppId) return

        try {
            setUploading(true)

            for (const file of files) {
                // 1. Upload to S3
                const formData = new FormData()

                formData.append('file', file)

                const appIdOrAdhoc = isAdhoc ? 'adhoc' : selectedAppId
                const path = `${profile.company_code}/${profile.user_email}/${appIdOrAdhoc}`
                formData.append('path', path)

                const uploadRes = await fetch('/api/fileupload', {
                    method: 'POST',
                    body: formData
                })

                if (!uploadRes.ok) throw new Error('Upload failed')

                const uploadData = await uploadRes.json()

                // 2. Store metadata in Supabase
                // Get the actual application_id string (e.g., "APP-0402-1234") from the selected app
                const selectedApp = applications.find(a => a.id.toString() === selectedAppId)
                const docLoadRes = await fetch('/api/docload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        company_code: profile.company_code,
                        user_email: profile.user_email,
                        application_id: isAdhoc ? null : selectedApp?.application_id,
                        document_type: 'Income',
                        document_name: file.name,
                        s3_document_url: uploadData.url,
                        file_size: file.size,
                        mime_type: file.type,
                        adhoc: isAdhoc ? 'yes' : ''
                    })
                })

                if (!docLoadRes.ok) throw new Error('Metadata storage failed')
            }

            // Store uploaded file names and type for success modal
            const fileNames = files.map(f => f.name)
            const selectedApplication = applications.find(a => a.id.toString() === selectedAppId)
            const leadName = selectedApplication ? `${selectedApplication.lead_first_name || ''} ${selectedApplication.lead_last_name || ''}`.trim() : ''
            const type = isAdhoc ? 'Adhoc' : `${selectedApplication?.application_id || 'Application'}${leadName ? ` - ${leadName}` : ''}`

            setUploadedFiles(fileNames)
            setUploadType(type)
            setShowSuccess(true)
            setFiles([])

            onUploadComplete?.()
        } catch (error) {
            console.error('Error uploading files:', error)
            alert('Failed to upload files. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleCloseSuccess = () => {
        setShowSuccess(false)
        setUploadedFiles([])
        setUploadType('')
        setSelectedAppId('')
        setIsAdhoc(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={showSuccess ? handleCloseSuccess : onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                {showSuccess ? (
                    <>
                        <div className="flex flex-col items-center py-6">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Upload Successful!</h2>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                {uploadedFiles.length} {uploadedFiles.length > 1 ? 'files have' : 'file has'} been uploaded successfully
                            </p>

                            <div className="w-full bg-muted rounded-lg p-4 mb-4">
                                <p className="text-xs text-muted-foreground mb-2 font-medium">Uploaded to: {uploadType}</p>
                                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                                    {uploadedFiles.map((fileName, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                            <span className="truncate">{fileName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 w-full">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    AI analysis will be available in less than 3 minutes
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCloseSuccess} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                Done
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Upload Documents</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Select an application or choose adhoc upload. You can upload multiple files.
                            </p>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="adhoc"
                                        checked={isAdhoc}
                                        onCheckedChange={(checked: boolean | 'indeterminate') => {
                                            setIsAdhoc(checked === true)
                                            if (checked === true) setSelectedAppId('')
                                        }}
                                    />
                                    <Label htmlFor="adhoc" className="text-foreground">Adhoc Upload (No Application)</Label>
                                </div>
                                <Button variant="ghost" size="sm" onClick={resetForm} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    Clear All
                                </Button>
                            </div>

                            {!isAdhoc && (
                                <div className="space-y-2">
                                    <Label className="text-foreground">Application</Label>
                                    <Select value={selectedAppId} onValueChange={setSelectedAppId} disabled={loadingApps}>
                                        <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                                            <SelectValue placeholder={loadingApps ? "Loading..." : "Select Application"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                            {applications.map((app) => (
                                                <SelectItem key={app.id} value={app.id.toString()} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                                                    {app.application_id} - {app.lead_first_name || ''} {app.lead_last_name || ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-foreground">Files</Label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative bg-white dark:bg-gray-800">
                                    <Input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Click to select files (PDF, Word, Excel, Text)</span>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2 text-foreground">Selected Files ({files.length})</h4>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded border border-border">
                                                    <div className="flex items-center gap-2 truncate max-w-[300px]">
                                                        <span className="truncate text-foreground">{file.name}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                                        <X className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={onClose} disabled={uploading} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</Button>
                            <Button onClick={handleSubmit} disabled={uploading || (!isAdhoc && !selectedAppId) || files.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
