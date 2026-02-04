"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Phone, Mail, Edit, FileText, Loader2 } from "lucide-react"
import LeadModal from "@/components/leads/LeadModal"
import { getLeads, createLead, updateLead, type Lead as APILead } from "@/lib/api/leads"
import { useUserProfile } from "@/contexts/UserProfileContext"

// Use the Lead type from the API
type Lead = APILead

export default function LeadsPage() {
  const { profile } = useUserProfile()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creatingAppForLead, setCreatingAppForLead] = useState<string | null>(null)

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
      console.error('Error fetching leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLead = () => {
    setModalMode("add")
    setSelectedLead(null)
    setModalOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setModalMode("edit")
    setSelectedLead(lead)
    setModalOpen(true)
  }

  const handleSaveLead = async (lead: any) => {
    if (!profile) {
      alert('User profile not loaded. Please refresh the page.')
      throw new Error('User profile not loaded')
    }

    try {
      if (modalMode === "add") {
        // Create new lead via API
        await createLead({
          company_code: profile.company_code,
          user_email: profile.user_email,
          lead_number: `LEAD-${Date.now()}`,
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email,
          mobile_phone: lead.mobile_phone,
          estimated_loan_amount: lead.estimated_loan_amount,
          loan_purpose: lead.loan_purpose,
          lead_status: lead.lead_status as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
          lead_source: lead.lead_source,
        })
      } else if (selectedLead) {
        // Update existing lead via API
        await updateLead(selectedLead.id, {
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email,
          mobile_phone: lead.mobile_phone,
          estimated_loan_amount: lead.estimated_loan_amount,
          loan_purpose: lead.loan_purpose,
          lead_status: lead.lead_status as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
          lead_source: lead.lead_source,
        })
      }

      // Refetch all leads from server to ensure UI shows latest data
      await fetchLeads()
    } catch (err) {
      console.error('Error saving lead:', err)
      alert(err instanceof Error ? err.message : 'Failed to save lead')
      throw err // Re-throw to let modal handle the error state
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleCreateApplication = async (lead: Lead) => {
    if (lead.lead_status === 'converted') {
      alert('This lead has already been converted to an application.')
      return
    }

    try {
      setCreatingAppForLead(lead.id)
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create application')
      }

      alert(`Application ${result.data.application_id} created successfully!`)
      await fetchLeads() // Refresh leads to show updated status
    } catch (err) {
      console.error('Error creating application:', err)
      alert(err instanceof Error ? err.message : 'Failed to create application')
    } finally {
      setCreatingAppForLead(null)
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-700'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-700'
      case 'qualified':
        return 'bg-green-100 text-green-700'
      case 'converted':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatLoanPurpose = (purpose?: string) => {
    if (!purpose) return "N/A"
    return purpose.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1">Manage your mortgage leads and prospects</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddLead}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-blue-600">
                  {leads.filter(l => l.lead_status === 'new').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.lead_status === 'qualified').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold text-purple-600">
                  {leads.filter(l => l.lead_status === 'converted').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Leads</h3>

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchLeads} className="mt-4" variant="outline">
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && leads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found. Add your first lead to get started!</p>
            </div>
          )}

          {!loading && !error && leads.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground">
                      {lead.first_name} {lead.last_name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          lead.lead_status
                        )}`}
                      >
                        {lead.lead_status.charAt(0).toUpperCase() + lead.lead_status.slice(1)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLead(lead)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      {lead.mobile_phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center">
                        <span>Loan:</span>
                        <span className="font-medium ml-1">
                          {formatCurrency(lead.estimated_loan_amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span>Purpose:</span>
                        <span className="font-medium ml-1">
                          {formatLoanPurpose(lead.loan_purpose)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant={lead.lead_status === 'converted' ? 'outline' : 'default'}
                        disabled={lead.lead_status === 'converted' || creatingAppForLead === lead.id}
                        onClick={() => handleCreateApplication(lead)}
                        className="w-full"
                      >
                        {creatingAppForLead === lead.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : lead.lead_status === 'converted' ? (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Application Created
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Application
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Modal */}
      <LeadModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSaveLead}
        lead={selectedLead}
        mode={modalMode}
      />
    </div>
  )
}
