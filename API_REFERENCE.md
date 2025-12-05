# API Reference

Quick reference for using the Supabase API in your application.

## Authentication API

### Client-Side Functions

```typescript
import { signIn, signUp, signOut, getCurrentUser, getSession } from '@/lib/api/auth'

// Sign up
const data = await signUp('email@example.com', 'password123')

// Sign in
const { user, session } = await signIn('email@example.com', 'password123')

// Sign out
await signOut()

// Get current user
const user = await getCurrentUser()

// Get session
const session = await getSession()

// Reset password
await resetPassword('email@example.com')
```

### API Routes

```bash
# POST /api/auth/signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# POST /api/auth/login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# POST /api/auth/logout
curl -X POST http://localhost:3000/api/auth/logout
```

---

## Leads API

### Client-Side Functions

```typescript
import { getLeads, getLead, createLead, updateLead, deleteLead } from '@/lib/api/leads'

// Get all leads
const leads = await getLeads()

// Get single lead
const lead = await getLead('uuid-here')

// Create lead
const newLead = await createLead({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  loan_amount: 350000,
  loan_purpose: 'home_purchase',
  status: 'new',
  source: 'website'
})

// Update lead
const updated = await updateLead('uuid-here', {
  status: 'contacted'
})

// Delete lead
await deleteLead('uuid-here')

// Get leads by status
const newLeads = await getLeadsByStatus('new')
```

### API Routes

```bash
# GET /api/leads - Get all leads
curl http://localhost:3000/api/leads

# POST /api/leads - Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "status": "new"
  }'

# GET /api/leads/:id - Get single lead
curl http://localhost:3000/api/leads/uuid-here

# PATCH /api/leads/:id - Update lead
curl -X PATCH http://localhost:3000/api/leads/uuid-here \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'

# DELETE /api/leads/:id - Delete lead
curl -X DELETE http://localhost:3000/api/leads/uuid-here
```

---

## Loan Applications API

### Client-Side Functions

```typescript
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication
} from '@/lib/api/applications'

// Get all applications
const apps = await getApplications()

// Get single application
const app = await getApplication('uuid-here')

// Create application
const newApp = await createApplication({
  lead_id: 'lead-uuid',
  client_name: 'John Doe',
  loan_amount: 350000,
  loan_type: 'Home Loan',
  status: 'pending',
  stage: 'Initial Review',
  progress: 10,
  submitted_date: '2025-01-14'
})

// Update application
const updated = await updateApplication('uuid-here', {
  status: 'approved',
  progress: 100
})

// Get by status
const pending = await getApplicationsByStatus('pending')
```

---

## Type Definitions

### Lead

```typescript
interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  loan_amount?: number
  loan_purpose?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source?: string
  created_at: string
  updated_at: string
}
```

### LoanApplication

```typescript
interface LoanApplication {
  id: string
  lead_id: string
  client_name: string
  loan_amount: number
  loan_type: string
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'on_hold'
  stage: string
  progress: number
  submitted_date: string
  created_at: string
  updated_at: string
}
```

---

## Using in React Components

### Example: Fetch and Display Leads

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getLeads, Lead } from '@/lib/api'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>
          {lead.first_name} {lead.last_name}
        </div>
      ))}
    </div>
  )
}
```

### Example: Create Lead Form

```typescript
'use client'

import { useState } from 'react'
import { createLead } from '@/lib/api'

export default function CreateLeadForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    status: 'new' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newLead = await createLead(formData)
      console.log('Lead created:', newLead)
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating lead:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.first_name}
        onChange={e => setFormData({...formData, first_name: e.target.value})}
        placeholder="First Name"
      />
      {/* More fields... */}
      <button type="submit">Create Lead</button>
    </form>
  )
}
```

---

## Direct Supabase Usage

For more complex queries, use the Supabase client directly:

```typescript
import { supabase } from '@/lib/supabase/client'

// Complex query with filters
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('status', 'new')
  .gte('loan_amount', 100000)
  .order('created_at', { ascending: false })
  .limit(10)

// With joins
const { data } = await supabase
  .from('loan_applications')
  .select(`
    *,
    lead:leads(*)
  `)
  .eq('status', 'in_progress')

// Real-time subscription
const channel = supabase
  .channel('leads_changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'leads' },
    (payload) => {
      console.log('Lead changed:', payload)
    }
  )
  .subscribe()
```

---

## Error Handling

Always wrap API calls in try-catch:

```typescript
try {
  const leads = await getLeads()
  setLeads(leads)
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message)
    // Show error to user
  }
}
```

---

## Next Steps

1. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for initial setup
2. Check [Supabase Docs](https://supabase.com/docs) for advanced features
3. Implement real-time subscriptions
4. Add file storage for documents
