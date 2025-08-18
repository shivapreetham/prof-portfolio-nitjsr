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

    // --- Sanitize filename to avoid "folders" ---
    // 1) Get the last part of the filename (remove any path separators)
    const baseName =
      filename.split('/').pop().split('\\').pop() || 'file';

    // 2) Replace anything other than safe characters with underscores
    const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 3) Keep length sane (optional)
    const trimmed = safeName.length > 180 ? safeName.slice(0, 180) : safeName;

    // 4) Final key → no slashes, so no "folders"
    const key = `${Date.now()}-${trimmed}`;

    // --- R2 Client ---
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

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // 1 hour
    });


    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_BASE}/${encodeURIComponent(key)}`;

    return new Response(
      JSON.stringify({
        success: true,
        presignedUrl,
        key,
        publicUrl,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Failed to generate upload URL',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
