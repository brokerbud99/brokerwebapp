'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload, X } from 'lucide-react'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadComplete?: () => void
}

const DOCUMENT_CATEGORIES = [
    'Income',
    'Properties',
    'Statements',
    'Employment',
    'Identification',
    'Other'
]

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
    const { profile } = useUserProfile()
    const [applications, setApplications] = useState<{ id: number; application_id: string }[]>([])
    const [selectedAppId, setSelectedAppId] = useState<string>('')
    const [isAdhoc, setIsAdhoc] = useState(false)
    const [category, setCategory] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [loadingApps, setLoadingApps] = useState(false)

    const resetForm = () => {
        setFiles([])
        setCategory('')
        setSelectedAppId('')
        setIsAdhoc(false)
    }

    const fetchApplications = useCallback(async () => {
        try {
            setLoadingApps(true)
            const { data, error } = await supabase
                .from('application')
                .select('id, application_id')
                .eq('company_code', profile?.company_code)
                .order('created_at', { ascending: false })

            if (error) throw error
            setApplications(data || [])
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
        if (!profile || !category || files.length === 0) return
        if (!isAdhoc && !selectedAppId) return

        try {
            setUploading(true)

            for (const file of files) {
                // 1. Upload to S3
                const formData = new FormData()

                // Rename file with category prefix
                const newFileName = `${category}_${file.name}`
                const renamedFile = new File([file], newFileName, { type: file.type })

                formData.append('file', renamedFile)

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
                const docLoadRes = await fetch('/api/docload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        company_code: profile.company_code,
                        user_email: profile.user_email,
                        application_id: isAdhoc ? null : parseInt(selectedAppId),
                        document_type: category,
                        document_name: newFileName,
                        s3_document_url: uploadData.url,
                        file_size: file.size,
                        mime_type: file.type,
                        adhoc: isAdhoc ? 'yes' : ''
                    })
                })

                if (!docLoadRes.ok) throw new Error('Metadata storage failed')
            }

            onUploadComplete?.()
            onClose()
            resetForm()

        } catch (error) {
            console.error('Error uploading files:', error)
            alert('Failed to upload files. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] text-foreground">
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
                                <SelectTrigger className="text-foreground">
                                    <SelectValue placeholder={loadingApps ? "Loading..." : "Select Application"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {applications.map((app) => (
                                        <SelectItem key={app.id} value={app.id.toString()} className="text-foreground">
                                            {app.application_id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-foreground">Document Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="text-foreground">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {DOCUMENT_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="text-foreground">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Files</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                            <Input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-muted-foreground">Click to select files (PDF, Word, Excel, Text)</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2 text-foreground">Selected Files ({files.length})</h4>
                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                                            <div className="flex items-center gap-2 truncate max-w-[300px]">
                                                {category && (
                                                    <Badge variant="secondary" className="shrink-0">
                                                        {category}
                                                    </Badge>
                                                )}
                                                <span className="truncate text-foreground">{file.name}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                                <X className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={uploading} className="text-foreground hover:bg-muted">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={uploading || (!isAdhoc && !selectedAppId) || !category || files.length === 0}>
                        {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
