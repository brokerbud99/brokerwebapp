"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Phone, Play, Download, Calendar, Clock } from "lucide-react"

const dummyCallRecordings = [
  {
    id: 1,
    clientName: "John Smith",
    duration: "12:34",
    date: "2025-01-11 10:30 AM",
    summary: "Initial consultation about home loan requirements",
    sentiment: "Positive",
    keyTopics: ["Home Loan", "Pre-approval", "Interest Rates"],
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    duration: "8:15",
    date: "2025-01-11 2:15 PM",
    summary: "Follow-up call regarding document submission",
    sentiment: "Neutral",
    keyTopics: ["Documents", "Income Verification", "Timeline"],
  },
  {
    id: 3,
    clientName: "Michael Brown",
    duration: "15:42",
    date: "2025-01-10 11:00 AM",
    summary: "Detailed discussion on investment property loan options",
    sentiment: "Positive",
    keyTopics: ["Investment Property", "Tax Benefits", "Rental Income"],
  },
]

export default function VoiceAIPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voice AI</h1>
          <p className="text-muted-foreground mt-1">AI-powered call recording and analysis</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Phone className="h-4 w-4 mr-2" />
          Start Recording
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
              <Phone className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold text-green-600">11m</p>
              </div>
              <Clock className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                <p className="text-2xl font-bold text-purple-600">78%</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Mic className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Voice AI automatically transcribes calls, analyzes sentiment, extracts key topics, and
                provides actionable insights to improve customer interactions and streamline your workflow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Recordings */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Calls</h3>
          <div className="space-y-4">
            {dummyCallRecordings.map((call) => (
              <div
                key={call.id}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{call.clientName}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{call.summary}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${call.sentiment === "Positive"
                        ? "bg-green-100 text-green-700"
                        : call.sentiment === "Neutral"
                          ? "bg-muted text-muted-foreground"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.sentiment}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {call.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {call.duration}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Key Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {call.keyTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Transcript
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
