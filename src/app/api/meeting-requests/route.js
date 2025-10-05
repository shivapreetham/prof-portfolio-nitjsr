import { MeetingRequest } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// GET - Fetch all meeting requests (sorted by createdAt descending)
export async function GET() {
  try {
    await connectDB();
    const requests = await MeetingRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching meeting requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting requests' },
      { status: 500 }
    );
  }
}

// POST - Create a new meeting request
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newRequest = new MeetingRequest({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      preferredDate: data.preferredDate,
      status: 'pending'
    });
    await newRequest.save();

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting request:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting request' },
      { status: 500 }
    );
  }
}
