import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Conference } from '@/models/models';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '67ed468b5b281d81f91a0a78';

const sanitizeLinks = (links) => {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .map((link) => (typeof link === 'string' ? link.trim() : ''))
      .filter(Boolean);
  }
  if (typeof links === 'string') {
    return links
      .split('\n')
      .map((link) => link.trim())
      .filter(Boolean);
  }
  return [];
};

export async function GET() {
  try {
    await connectDB();
    const conferences = await Conference.find({ userId: DEFAULT_USER_ID }).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json({ message: 'Failed to fetch conferences' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, location, date, paperPresented = false, description = '' } = data;

    if (!name || !date) {
      return NextResponse.json({ message: 'Conference name and date are required' }, { status: 400 });
    }

    await connectDB();

    const conference = new Conference({
      userId: DEFAULT_USER_ID,
      name,
      location,
      date: new Date(date),
      paperPresented: Boolean(paperPresented),
      description,
      links: sanitizeLinks(data.links)
    });

    await conference.save();

    return NextResponse.json(conference, { status: 201 });
  } catch (error) {
    console.error('Error creating conference:', error);
    return NextResponse.json({ message: 'Failed to create conference' }, { status: 500 });
  }
}
