export interface Lead {
  id: string
  company_code: string
  user_email: string
  lead_number: string
  lead_source?: string
  lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  referrer_name?: string
  first_name: string
  last_name: string
  email: string
  mobile_phone?: string
  alternative_phone?: string
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
  tags?: string[]
  credit_issues_known?: string
  existing_property_owner?: boolean
  deposit_available_range?: string
  current_lender?: string
  number_of_dependents?: number
  marketing_consent?: boolean
  assigned_broker?: string
  last_contact_date?: string
  next_followup_date?: string
  converted_to_application_date?: string
  conversion_status?: string
  created_at: string
  created_by?: string
  updated_at: string
  updated_by?: string
}

/**
 * Fetch all leads
 */
export async function getLeads() {
  const response = await fetch('/api/leads', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch leads')
  }

  const result = await response.json()
  return result.data as Lead[]
}

/**
 * Fetch a single lead by ID
 */
export async function getLead(id: string) {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch lead')
  }

  return response.json() as Promise<Lead>
}

/**
 * Create a new lead
 */
export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create lead')
  }

  const result = await response.json()
  return result.data as Lead
}

/**
 * Update an existing lead
 */
export async function updateLead(id: string, updates: Partial<Lead>) {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update lead')
  }

  return response.json() as Promise<Lead>
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string) {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete lead')
  }

  return response.json()
}

/**
 * Get leads by status
 */
export async function getLeadsByStatus(status: Lead['status']) {
  const response = await fetch(`/api/leads?status=${status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch leads by status')
  }

  const result = await response.json()
  return result.data as Lead[]
}
