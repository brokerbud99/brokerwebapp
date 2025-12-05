"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Eye, CheckCircle, AlertCircle } from "lucide-react"
import { UploadModal } from "@/components/UploadModal"

const dummyDocuments = [
  {
    id: 1,
    name: "Income_Statement_John_Smith.pdf",
    type: "Income Verification",
    uploadedBy: "John Smith",
    uploadDate: "2025-01-11",
    status: "Verified",
    aiExtracted: {
      income: "$85,000/year",
      employer: "ABC Corporation",
      employment: "Full-time",
    },
  },
  {
    id: 2,
    name: "Bank_Statement_Sarah_Johnson.pdf",
    type: "Bank Statement",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2025-01-10",
    status: "Processing",
    aiExtracted: {
      balance: "$45,230",
      transactions: "156 in 3 months",
      avgDeposit: "$4,200/month",
    },
  },
  {
    id: 3,
    name: "Credit_Report_Michael_Brown.pdf",
    type: "Credit Report",
    uploadedBy: "Michael Brown",
    uploadDate: "2025-01-09",
    status: "Verified",
    aiExtracted: {
      score: "742",
      accounts: "8 Active",
      inquiries: "2 in 6 months",
    },
  },
  {
    id: 4,
    name: "Property_Valuation_123_Main.pdf",
    type: "Property Valuation",
    uploadedBy: "You",
    uploadDate: "2025-01-08",
    status: "Review Required",
    aiExtracted: {
      value: "$550,000",
      propertyType: "Residential",
      bedrooms: "4",
    },
  },
]

export default function DocumentsAIPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleUploadComplete = () => {
    // In a real app, you would refetch the documents list here
    alert("Documents uploaded successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents AI</h1>
          <p className="text-gray-600 mt-1">AI-powered document processing and verification</p>
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

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">198</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">32</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Review Required</p>
                <p className="text-2xl font-bold text-orange-600">17</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Intelligent Document Processing
              </h3>
              <p className="text-gray-700 mb-3">
                Our AI automatically extracts key information from documents, verifies authenticity,
                and flags potential issues for review. Save hours of manual data entry and reduce errors.
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Auto data extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Document verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Fraud detection</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
          <div className="space-y-4">
            {dummyDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${doc.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : doc.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-2 font-medium">AI Extracted Data:</p>
                  <div className="grid md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(doc.aiExtracted).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium text-gray-900 ml-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div>
                    Uploaded by <span className="font-medium">{doc.uploadedBy}</span> on {doc.uploadDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
