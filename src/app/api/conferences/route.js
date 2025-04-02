import { NextResponse } from 'next/server';
import { Conference } from '@/models/models';
import connectDB from '@/utils/db';

export async function GET() {
  try {
    await connectDB();
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

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newConference = new Conference({
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
