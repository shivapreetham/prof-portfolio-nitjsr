import { MeetingRequest } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// GET - Fetch single meeting request
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const meetingRequest = await MeetingRequest.findById(id);

    if (!meetingRequest) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(meetingRequest);
  } catch (error) {
    console.error('Error fetching meeting request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting request' },
      { status: 500 }
    );
  }
}

// PUT - Update meeting request (mainly for status updates)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatedRequest = await MeetingRequest.findByIdAndUpdate(
      id,
      {
        status: data.status
      },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating meeting request:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting request' },
      { status: 500 }
    );
  }
}

// DELETE - Delete meeting request
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedRequest = await MeetingRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Meeting request deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting request:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting request' },
      { status: 500 }
    );
  }
}
