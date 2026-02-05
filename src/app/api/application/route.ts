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
                    setAll: () => { },
                },
            }
        )
        return supabase
    }

    // Fallback to cookie-based auth (for web browser clients)
    return await createClient()
}

// Generate unique application ID: APP-DDMM-XXXX
function generateApplicationId(): string {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(1000 + Math.random() * 9000) // 4-digit random number (1000-9999)
    return `APP-${day}${month}-${random}`
}

// GET /api/application - Fetch all applications
export async function GET(request: NextRequest) {
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

        // Fetch applications for this user
        const { data, error } = await supabase
            .from('application')
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

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Fetch applications error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/application - Create a new application
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
        const { lead_id } = body

        if (!lead_id) {
            return NextResponse.json(
                { error: 'lead_id is required' },
                { status: 400 }
            )
        }

        // Create application data
        const applicationData = {
            application_id: generateApplicationId(),
            lead_id: String(lead_id),
            company_code: profile.company_code,
            user_email: profile.user_email,
        }

        const { data, error } = await supabase
            .from('application')
            .insert([applicationData])
            .select()
            .single()

        if (error) {
            console.error('Insert application error:', error)
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        // Update lead status to 'converted' and set conversion date
        await supabase
            .from('leads')
            .update({
                lead_status: 'converted',
                conversion_status: 'converted',
                converted_to_application_date: new Date().toISOString()
            })
            .eq('id', lead_id)

        return NextResponse.json({ success: true, data }, { status: 201 })
    } catch (error) {
        console.error('Create application error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
