import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

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

export async function POST(request: NextRequest) {
    try {
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json();
        const {
            document_type,
            document_name,
            s3_document_url,
            file_size,
            mime_type,
            adhoc
        } = body;

        // Fetch user profile to get company_code and ensure data integrity
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

        if (!document_type || !document_name || !s3_document_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('document_analysis_ai')
            .insert([
                {
                    company_code: profile.company_code,
                    user_email: profile.user_email,
                    document_type,
                    document_name,
                    s3_document_url,
                    file_size,
                    mime_type,
                    adhoc,
                    upload_date: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in docload:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
