"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Lead {
  id?: string
  first_name: string
  last_name: string
  email: string
  mobile_phone?: string
  alternative_phone?: string
  lead_source?: string
  lead_status: string
  referrer_name?: string
  preferred_contact_method?: string
  best_time_to_contact?: string
  loan_purpose?: string
  property_type?: string
  estimated_loan_amount?: number
  estimated_property_value?: number
  employment_status?: string
  approximate_annual_income_range?: string
  current_location?: string
  property_location?: string
  is_first_home_buyer?: boolean
  expected_settlement_timeline?: string
  urgency_level?: string
  pre_approval_needed?: boolean
  notes?: string
  credit_issues_known?: string
  existing_property_owner?: boolean
  deposit_available_range?: string
  current_lender?: string
  number_of_dependents?: number
  marketing_consent?: boolean
}

interface LeadModalProps {
  open: boolean
  onClose: () => void
  onSave: (lead: Lead) => Promise<void>
  lead?: Lead | null
  mode: "add" | "edit"
}

export default function LeadModal({ open, onClose, onSave, lead, mode }: LeadModalProps) {
  const [formData, setFormData] = useState<Lead>({
    first_name: "",
    last_name: "",
    email: "",
    mobile_phone: "",
    lead_status: "new",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (lead && mode === "edit") {
      setFormData(lead)
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile_phone: "",
        lead_status: "new",
      })
    }
    setShowSuccess(false)
    setIsSubmitting(false)
  }, [lead, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSave(formData)
      setShowSuccess(true)

      // Auto-close after 1.5 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      // Error is handled by parent component
    }
  }

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Lead" : "Edit Lead"}</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mode === "add" ? "Lead Added Successfully!" : "Lead Updated Successfully!"}
            </h3>
            <p className="text-gray-600">Refreshing data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile_phone">Mobile Phone *</Label>
                  <Input
                    id="mobile_phone"
                    value={formData.mobile_phone || ""}
                    onChange={(e) => handleChange("mobile_phone", e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alternative_phone">Alternative Phone</Label>
                  <Input
                    id="alternative_phone"
                    value={formData.alternative_phone || ""}
                    onChange={(e) => handleChange("alternative_phone", e.target.value)}
                    className="text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="lead_status">Lead Status *</Label>
                  <Select
                    value={formData.lead_status}
                    onValueChange={(value) => handleChange("lead_status", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lead Source & Contact Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Source & Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead_source">Lead Source</Label>
                  <Select
                    value={formData.lead_source || ""}
                    onValueChange={(value) => handleChange("lead_source", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="phone_inquiry">Phone Inquiry</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="walk_in">Walk In</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referrer_name">Referrer Name</Label>
                  <Input
                    id="referrer_name"
                    value={formData.referrer_name || ""}
                    onChange={(e) => handleChange("referrer_name", e.target.value)}
                    className="text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
                  <Select
                    value={formData.preferred_contact_method || ""}
                    onValueChange={(value) => handleChange("preferred_contact_method", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="best_time_to_contact">Best Time to Contact</Label>
                  <Input
                    id="best_time_to_contact"
                    value={formData.best_time_to_contact || ""}
                    onChange={(e) => handleChange("best_time_to_contact", e.target.value)}
                    placeholder="e.g., Weekdays 9am-5pm"
                    className="text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Loan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loan_purpose">Loan Purpose</Label>
                  <Select
                    value={formData.loan_purpose || ""}
                    onValueChange={(value) => handleChange("loan_purpose", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_purchase">Home Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={formData.property_type || ""}
                    onValueChange={(value) => handleChange("property_type", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimated_loan_amount">Estimated Loan Amount</Label>
                  <Input
                    id="estimated_loan_amount"
                    type="number"
                    value={formData.estimated_loan_amount || ""}
                    onChange={(e) => handleChange("estimated_loan_amount", parseFloat(e.target.value))}
                    placeholder="350000"
                    className="text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="estimated_property_value">Estimated Property Value</Label>
                  <Input
                    id="estimated_property_value"
                    type="number"
                    value={formData.estimated_property_value || ""}
                    onChange={(e) => handleChange("estimated_property_value", parseFloat(e.target.value))}
                    placeholder="500000"
                    className="text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employment_status">Employment Status</Label>
                  <Select
                    value={formData.employment_status || ""}
                    onValueChange={(value) => handleChange("employment_status", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="self_employed">Self Employed</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgency_level">Urgency Level</Label>
                  <Select
                    value={formData.urgency_level || ""}
                    onValueChange={(value) => handleChange("urgency_level", value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  placeholder="Additional notes about this lead..."
                  className="text-foreground"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "add" ? "Add Lead" : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
