import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const customPath = formData.get('path') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'File is required.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Use custom path if provided, otherwise fallback to default timestamp naming
        const key = customPath ? `${customPath}/${file.name}` : `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_Bucket,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const fileUrl = `https://${process.env.AWS_S3_Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: file.name,
            key: key
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Error uploading file.' },
            { status: 500 }
        );
    }
}
