import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Photo } from '@/models/models';

export async function GET() {
  try {
    await connectDB();
    const photos = await Photo.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const photosData = Array.isArray(data) ? data : [data];
    const photos = await Photo.insertMany(photosData);
    return NextResponse.json(photos, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo(s)' }, { status: 500 });
  }
}

