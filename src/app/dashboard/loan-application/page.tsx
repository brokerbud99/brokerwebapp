"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"

const dummyApplications = [
  {
    id: 1,
    clientName: "John Smith",
    loanAmount: "$350,000",
    loanType: "Home Loan",
    status: "In Progress",
    stage: "Document Collection",
    submittedDate: "2025-01-10",
    progress: 65,
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    loanAmount: "$450,000",
    loanType: "Refinance",
    status: "Approved",
    stage: "Settlement",
    submittedDate: "2025-01-05",
    progress: 90,
  },
  {
    id: 3,
    clientName: "Michael Brown",
    loanAmount: "$280,000",
    loanType: "Investment Property",
    status: "Pending",
    stage: "Assessment",
    submittedDate: "2025-01-12",
    progress: 30,
  },
  {
    id: 4,
    clientName: "Emily Davis",
    loanAmount: "$520,000",
    loanType: "Construction Loan",
    status: "On Hold",
    stage: "Additional Info Required",
    submittedDate: "2025-01-08",
    progress: 45,
  },
]

export default function LoanApplicationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage loan applications</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">28</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">14</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {dummyApplications.map((app) => (
              <div
                key={app.id}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{app.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{app.loanType}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "On Hold"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-foreground ml-2">{app.loanAmount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stage:</span>
                    <span className="text-foreground ml-2">{app.stage}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="text-foreground ml-2">{app.submittedDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{app.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${app.progress >= 80
                          ? "bg-green-600"
                          : app.progress >= 50
                            ? "bg-blue-600"
                            : "bg-orange-600"
                        }`}
                      style={{ width: `${app.progress}%` }}
                    />
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
