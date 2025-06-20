import { NextResponse } from 'next/server';
import { Conference } from '@/models/models';
import connectDB from '@/utils/db';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// PUT - Update a conference by ID (and hardcoded userId if required)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatedConference = await Conference.findOneAndUpdate(
      { _id: id, userId: HARDCODED_USER_ID },
      {
        name: data.name,
        location: data.location,
        date: new Date(data.date),
        paperPresented: data.paperPresented
      },
      { new: true }
    );
    if (!updatedConference) {
      return NextResponse.json(
        { error: 'Conference not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedConference);
  } catch (error) {
    console.error('Error updating conference:', error);
    return NextResponse.json(
      { error: 'Failed to update conference' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a conference by ID (with userId filter)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedConference = await Conference.findOneAndDelete({ _id: id, userId: HARDCODED_USER_ID });
    if (!deletedConference) {
      return NextResponse.json(
        { error: 'Conference not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conference:', error);
    return NextResponse.json(
      { error: 'Failed to delete conference' },
      { status: 500 }
    );
  }
}
