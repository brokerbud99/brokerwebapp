import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

// Helper to create Supabase client with authorization header support
async function getAuthenticatedSupabase(request: NextRequest) {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

    if (bearerToken) {
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

    return await createClient()
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// POST /api/document-preview - Generate presigned URL for document viewing
export async function POST(request: NextRequest) {
    try {
        const supabase = await getAuthenticatedSupabase(request)

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json();
        const { s3_url } = body;

        if (!s3_url) {
            return NextResponse.json(
                { error: 'S3 URL is required' },
                { status: 400 }
            );
        }

        // Extract the key from the S3 URL
        // URL format: https://bucket.s3.region.amazonaws.com/key or https://s3.region.amazonaws.com/bucket/key
        let key: string;
        try {
            const url = new URL(s3_url);
            // Remove leading slash from pathname
            key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

            // If the URL contains bucket name in path (s3.region.amazonaws.com/bucket/key format)
            if (url.hostname.startsWith('s3.')) {
                const parts = key.split('/');
                parts.shift(); // Remove bucket name
                key = parts.join('/');
            }

            // Decode URL-encoded characters (e.g., %20 -> space)
            key = decodeURIComponent(key);
        } catch {
            return NextResponse.json(
                { error: 'Invalid S3 URL format' },
                { status: 400 }
            );
        }

        const bucket = process.env.AWS_S3_Bucket;
        if (!bucket) {
            return NextResponse.json(
                { error: 'S3 bucket not configured' },
                { status: 500 }
            );
        }

        // Generate presigned URL valid for 1 hour
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return NextResponse.json({
            success: true,
            presignedUrl,
            key,
        });

    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate preview URL' },
            { status: 500 }
        );
    }
}
