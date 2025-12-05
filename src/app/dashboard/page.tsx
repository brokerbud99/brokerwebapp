"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckSquare, FileText, Mic, FileSearch, TrendingUp, DollarSign, Activity } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's what's happening with your mortgage brokerage today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold text-foreground">23</p>
                <p className="text-xs text-primary mt-1">+12% from last month</p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Applications</p>
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-xs text-secondary mt-1">3 pending approval</p>
              </div>
              <Activity className="h-10 w-10 text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">$2.4M</p>
                <p className="text-xs text-accent mt-1">Loan volume</p>
              </div>
              <DollarSign className="h-10 w-10 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold text-foreground">52%</p>
                <p className="text-xs text-primary mt-1">+5% from last month</p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border shadow-md hover:border-primary bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Leads</h3>
                    <p className="text-sm text-muted-foreground">Manage your prospects and potential clients</p>
                    <p className="text-xs text-primary mt-2 font-medium">23 active leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/todo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border shadow-md hover:border-primary bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">To Do</h3>
                    <p className="text-sm text-muted-foreground">Track your tasks and daily activities</p>
                    <p className="text-xs text-secondary mt-2 font-medium">9 pending tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/loan-application">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border shadow-md hover:border-primary bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Loan Applications</h3>
                    <p className="text-sm text-muted-foreground">Monitor and manage loan applications</p>
                    <p className="text-xs text-primary mt-2 font-medium">12 in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/voice-ai">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border shadow-md hover:border-primary bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Mic className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Voice AI</h3>
                    <p className="text-sm text-muted-foreground">AI-powered call recording and insights</p>
                    <p className="text-xs text-accent mt-2 font-medium">23 calls this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/documents-ai">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border shadow-md hover:border-primary bg-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <FileSearch className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Documents AI</h3>
                    <p className="text-sm text-muted-foreground">Intelligent document processing</p>
                    <p className="text-xs text-secondary mt-2 font-medium">17 pending review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckSquare className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Sarah Johnson's</span> loan application was approved
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  New lead added: <span className="font-medium">Emily Davis</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Michael Brown</span> uploaded income documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mic className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  Completed consultation call with <span className="font-medium">John Smith</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
