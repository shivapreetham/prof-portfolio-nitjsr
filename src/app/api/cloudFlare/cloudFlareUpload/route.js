import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(req) {
  try {
    const { filename, contentType } = await req.json();
    if (!filename || !contentType) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing filename or contentType' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const key = `${Date.now()}-${filename}`;

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 });

    return new Response(
      JSON.stringify({
        success: true,
        presignedUrl,
        key,
        publicUrl: `https://pub-638bee415f4749059222e128b1afc495.r2.dev/${key}`, // Public URL
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Failed to generate upload URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
