import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

const BACKEND_API_URL = 'https://broker.codedream.com.au/api/v1/process-document';

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
        const { document_id } = body;

        if (!document_id) {
            return NextResponse.json(
                { error: 'document_id is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.backendapi_key;
        if (!apiKey) {
            console.error('backendapi_key is not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({ document_id: String(document_id) }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Process document API returned non-JSON response:', response.status, text.substring(0, 200));
            return NextResponse.json(
                { error: 'Process document API returned an unexpected response', status: response.status },
                { status: 502 }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            console.error('Process document API error:', data);
            return NextResponse.json(
                { error: data.error || 'Failed to process document', details: data },
                { status: response.status }
            );
        }

        // Store the API response in the result_ai JSONB column
        const { error: updateError } = await supabase
            .from('document_analysis_ai')
            .update({ result_ai: data })
            .eq('id', document_id);

        if (updateError) {
            console.error('Error storing result_ai:', updateError);
            return NextResponse.json(
                { error: 'Document processed but failed to store result', details: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Error calling process-document API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
