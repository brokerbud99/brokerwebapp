import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'

// Helper to create Supabase client with authorization header support
async function getAuthenticatedSupabase(request: NextRequest) {
  // Try to get authorization from header (for mobile/external clients)
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

  if (bearerToken) {
    // Create client with bearer token for mobile/external clients
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    )
    return supabase
  }

  // Fallback to cookie-based auth (for web browser clients)
  return await createClient()
}

// GET /api/leads - Fetch all leads
export async function GET(request: NextRequest) {
  try {
    const supabase = await getAuthenticatedSupabase(request)

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile to get company_code and user_email
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('company_code, user_email')
      .eq('user_email', user.email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Fetch leads filtered by company_code and user_email
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('company_code', profile.company_code)
      .eq('user_email', profile.user_email)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Fetch leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = await getAuthenticatedSupabase(request)

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile to get company_code
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('company_code, user_email')
      .eq('user_email', user.email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Server-side validation: Override critical fields with authenticated user's data
    const leadData = {
      ...body,
      company_code: profile.company_code,  // Force from profile
      user_email: profile.user_email,      // Force from profile
      created_by: user.id,                 // Set creator
    }

    // Ensure lead_number exists (generate if not provided)
    if (!leadData.lead_number) {
      leadData.lead_number = `LEAD-${Date.now()}`
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Insert lead error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
