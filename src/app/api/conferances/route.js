// app/api/conferences/route.js
import { NextResponse } from 'next/server';
import { Conference } from '@/models/models';

// GET /api/conferences
export async function GET() {
  try {
    const conferences = await Conference.find().sort({ date: -1 });
    return NextResponse.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conferences' },
      { status: 500 }
    );
  }
}

// POST /api/conferences
export async function POST(request) {
  try {
    const data = await request.json();
    
    const newConference = new Conference({
      userId: data.userId || "1",
      name: data.name,
      location: data.location,
      date: new Date(data.date),
      paperPresented: data.paperPresented
    });
    
    await newConference.save();
    
    return NextResponse.json(newConference, { status: 201 });
  } catch (error) {
    console.error('Error creating conference:', error);
    return NextResponse.json(
      { error: 'Failed to create conference' },
      { status: 500 }
    );
  }
}
