import { NextResponse } from 'next/server';
import { Conference } from '@/models/models';
import connectDB from '@/utils/db';

// PUT - Update a conference by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatedConference = await Conference.findByIdAndUpdate(
      id,
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

// DELETE - Remove a conference by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedConference = await Conference.findByIdAndDelete(id);
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
