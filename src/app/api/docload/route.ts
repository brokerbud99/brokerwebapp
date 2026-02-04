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

// GET /api/docload - Fetch documents for the logged-in user
export async function GET(request: NextRequest) {
    try {
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user profile to get user_email
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_email')
            .eq('user_email', user.email)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'User profile not found' },
                { status: 404 }
            )
        }

        // Fetch documents for this user
        const { data, error } = await supabase
            .from('document_analysis_ai')
            .select('*')
            .eq('user_email', profile.user_email)
            .order('upload_date', { ascending: false })

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
        console.error('Error fetching documents:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
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
            adhoc,
            application_id
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
                    application_id: application_id || null,
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

        // Fire-and-forget: Call process-document API asynchronously (don't wait for it)
        const apiKey = process.env.backendapi_key;
        if (apiKey && data?.id) {
            // Use an async IIFE to call the external API without blocking
            (async () => {
                try {
                    const processResponse = await fetch('https://broker.codedream.com.au/api/v1/process-document', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Key': apiKey,
                        },
                        body: JSON.stringify({ document_id: String(data.id) }),
                    });
                    const contentType = processResponse.headers.get('content-type') || '';
                    if (!contentType.includes('application/json')) {
                        const text = await processResponse.text();
                        console.error('Process document API returned non-JSON response:', processResponse.status, text.substring(0, 200));
                    } else {
                        const processResult = await processResponse.json();
                        if (!processResponse.ok) {
                            console.error('Process document API error:', processResult);
                        } else {
                            // Store the API response in result_ai JSONB column
                            const supabaseForUpdate = await createClient();
                            const { error: updateError } = await supabaseForUpdate
                                .from('document_analysis_ai')
                                .update({ result_ai: processResult })
                                .eq('id', data.id);
                            if (updateError) {
                                console.error('Error storing result_ai:', updateError);
                            }
                        }
                    }
                } catch (processError) {
                    console.error('Error calling process-document API:', processError);
                }
            })();
        }

        // Return immediately - AI processing happens in the background
        return NextResponse.json({
            success: true,
            data,
            message: 'Document uploaded successfully. AI analysis will be available in less than 3 minutes.'
        });

    } catch (error) {
        console.error('Error in docload:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
