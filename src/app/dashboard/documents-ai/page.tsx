"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Eye, CheckCircle, AlertCircle, Loader2, RefreshCw, Brain, X } from "lucide-react"
import { UploadModal } from "@/components/UploadModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DocumentResultAI {
  data?: {
    year_to_date_gross?: string
    employer_name?: string
    employment_type?: string
    document_type?: string
    [key: string]: string | undefined
  }
  status?: string
  document_type?: string
  success?: boolean
}

interface Document {
  id: number
  document_name: string
  document_type: string
  user_email: string
  upload_date: string
  doc_status: string | null
  result_ai: DocumentResultAI | null
  s3_document_url: string
}

export default function DocumentsAIPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocForAI, setSelectedDocForAI] = useState<Document | null>(null)
  const [viewerDoc, setViewerDoc] = useState<Document | null>(null)
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/docload')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch documents')
      }

      setDocuments(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUploadComplete = () => {
    fetchDocuments()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDocuments()
    setRefreshing(false)
  }

  const handleViewDocument = async (doc: Document) => {
    setViewerDoc(doc)
    setViewerLoading(true)
    setViewerUrl(null)

    try {
      const response = await fetch('/api/document-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3_url: doc.s3_document_url })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get preview URL')
      }

      setViewerUrl(result.presignedUrl)
    } catch (err) {
      console.error('Error getting preview URL:', err)
      alert('Failed to load document preview. Please try downloading instead.')
      setViewerDoc(null)
    } finally {
      setViewerLoading(false)
    }
  }

  const closeViewer = () => {
    setViewerDoc(null)
    setViewerUrl(null)
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const isViewableInBrowser = (filename: string) => {
    const ext = getFileExtension(filename)
    return ['pdf', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
  }

  const getStatusBadge = (doc: Document) => {
    const status = doc.result_ai?.status || doc.doc_status || 'pending'

    if (status === 'processed' || status === 'verified') {
      return { label: 'Verified', className: 'bg-green-100 text-green-700' }
    } else if (status === 'processing' || status === 'pending') {
      return { label: 'Processing', className: 'bg-blue-100 text-blue-700' }
    } else if (status === 'failed' || status === 'error') {
      return { label: 'Failed', className: 'bg-red-100 text-red-700' }
    } else {
      return { label: 'Review Required', className: 'bg-orange-100 text-orange-700' }
    }
  }

  const getAIExtractedData = (doc: Document) => {
    const resultAI = doc.result_ai
    if (!resultAI?.data) return null

    // For Income document type, show specific fields
    if (doc.document_type === 'Income' || resultAI.document_type === 'Income') {
      return {
        income: resultAI.data.year_to_date_gross ? `$${resultAI.data.year_to_date_gross}` : 'N/A',
        employer: resultAI.data.employer_name || 'N/A',
        employment: resultAI.data.employment_type || 'N/A',
      }
    }

    // For other document types, show available data
    const data: Record<string, string> = {}
    if (resultAI.data.employer_name) data.employer = resultAI.data.employer_name
    if (resultAI.data.employment_type) data.employment = resultAI.data.employment_type
    if (resultAI.data.year_to_date_gross) data.income = `$${resultAI.data.year_to_date_gross}`

    return Object.keys(data).length > 0 ? data : null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate stats
  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.result_ai?.status === 'processed' || d.doc_status === 'verified').length,
    processing: documents.filter(d => !d.result_ai?.status && !d.doc_status).length,
    review: documents.filter(d => d.result_ai?.status === 'failed' || d.doc_status === 'review').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents AI</h1>
          <p className="text-muted-foreground mt-1">AI-powered document processing and verification</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* AI Result Modal */}
      <Dialog open={!!selectedDocForAI} onOpenChange={() => setSelectedDocForAI(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-foreground">AI Analysis Result</DialogTitle>
            {selectedDocForAI && (
              <p className="text-sm text-muted-foreground">
                {selectedDocForAI.document_name}
              </p>
            )}
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            {selectedDocForAI?.result_ai ? (
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-words text-foreground">
                {JSON.stringify(selectedDocForAI.result_ai, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground text-center py-8">No AI result available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={!!viewerDoc} onOpenChange={closeViewer}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[85vh] p-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col h-full">
            <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-border space-y-0">
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">{viewerDoc?.document_name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{viewerDoc?.document_type}</p>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {viewerLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading document...</span>
                </div>
              ) : viewerUrl ? (
                isViewableInBrowser(viewerDoc?.document_name || '') ? (
                  <iframe
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    title={viewerDoc?.document_name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-center">
                      This file type ({getFileExtension(viewerDoc?.document_name || '')}) cannot be previewed in the browser.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(viewerUrl, '_blank')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = viewerUrl
                          link.download = viewerDoc?.document_name || 'document'
                          link.click()
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Unable to load document preview</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Review Required</p>
                <p className="text-2xl font-bold text-orange-600">{stats.review}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

    

      {/* Documents List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Documents</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading documents...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchDocuments}>
                Try Again
              </Button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet.</p>
              <Button
                className="mt-4"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => {
                const statusBadge = getStatusBadge(doc)
                const aiData = getAIExtractedData(doc)

                return (
                  <div
                    key={doc.id}
                    className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{doc.document_name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    {aiData && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">AI Extracted Data:</p>
                        <div className="grid md:grid-cols-3 gap-2 text-sm">
                          {Object.entries(aiData).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground capitalize">{key}:</span>
                              <span className="font-medium text-foreground ml-1">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>
                        Uploaded on {formatDate(doc.upload_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.s3_document_url
                            link.download = doc.document_name
                            link.click()
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => setSelectedDocForAI(doc)}
                          disabled={!doc.result_ai}
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          AI Result
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
