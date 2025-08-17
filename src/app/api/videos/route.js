import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Video } from '@/models/models';

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const video = new Video(data);
    await video.save();
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

