import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Photo } from '@/models/models';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const updated = await Photo.findByIdAndUpdate(new ObjectId(id), data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Photo.findByIdAndDelete(new ObjectId(id));
    if (!deleted) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    if (deleted.imageUrl) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: deleted.imageUrl }),
        });
        const data = await res.json();
        if (!data.success) {
          console.warn('Cloudflare image deletion failed:', data.error);
        }
      } catch (err) {
        console.error('Error calling Cloudflare deletion API:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}

