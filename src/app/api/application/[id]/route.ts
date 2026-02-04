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

// GET /api/application/[id] - Fetch a single application
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('application')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Fetch application error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/application/[id] - Update an application
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Prevent updating critical fields
        const { id: _id, application_id, company_code, user_email, created_at, ...updateData } = body

        const { data, error } = await supabase
            .from('application')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update application error:', error)
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Update application error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/application/[id] - Delete an application
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('application')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete application error:', error)
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, message: 'Application deleted successfully' })
    } catch (error) {
        console.error('Delete application error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
