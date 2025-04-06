import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Modified helper function to extract full key (with subfolder, if any)
function extractKeyFromUrl(url) {
  const urlObj = new URL(url);
  const decodedPath = decodeURIComponent(urlObj.pathname);
  return decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath;
}

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Missing imageUrl' }, { status: 400 });
    }

    const key = extractKeyFromUrl(imageUrl);
    if (!key) {
      return NextResponse.json({ success: false, error: 'Invalid imageUrl format' }, { status: 400 });
    }

    const deleteParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
