"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Activity, Loader2 } from "lucide-react"
import { useUserProfile } from "@/contexts/UserProfileContext"
import { supabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { profile } = useUserProfile()
  const [leadsCount, setLeadsCount] = useState<number>(0)
  const [applicationsCount, setApplicationsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?.user_email || !profile?.company_code) return

      try {
        setLoading(true)

        // Fetch leads count
        const { count: leadsTotal, error: leadsError } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('company_code', profile.company_code)
          .eq('user_email', profile.user_email)

        if (leadsError) {
          console.error('Error fetching leads count:', leadsError)
        } else {
          setLeadsCount(leadsTotal || 0)
        }

        // Fetch applications count
        const { count: appsTotal, error: appsError } = await supabase
          .from('application')
          .select('*', { count: 'exact', head: true })
          .eq('company_code', profile.company_code)
          .eq('user_email', profile.user_email)

        if (appsError) {
          console.error('Error fetching applications count:', appsError)
        } else {
          setApplicationsCount(appsTotal || 0)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [profile?.user_email, profile?.company_code])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your mortgage brokerage today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : leadsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All leads in system</p>
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
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : applicationsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total applications</p>
              </div>
              <Activity className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">$0M</p>
                <p className="text-xs text-muted-foreground mt-1">Loan volume</p>
              </div>
              <DollarSign className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

      
      </div>

      
    </div>
  )
}
