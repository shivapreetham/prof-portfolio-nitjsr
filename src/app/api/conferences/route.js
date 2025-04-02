import { NextResponse } from 'next/server';
import { Conference } from '@/models/models';
import connectDB from '@/utils/db';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all conferences for the hardcoded user (sorted by date descending)
export async function GET() {
  try {
    await connectDB();
    const conferences = await Conference.find({ userId: HARDCODED_USER_ID }).sort({ date: -1 });
    return NextResponse.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conferences' },
      { status: 500 }
    );
  }
}

// POST - Create a new conference with hardcoded userId
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newConference = new Conference({
      userId: HARDCODED_USER_ID,
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
