import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { TeachingExperience } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// PUT - Update a teaching experience
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const updatedExperience = await TeachingExperience.findOneAndUpdate(
      { _id: new ObjectId(id), userId: HARDCODED_USER_ID },
      data,
      { new: true }
    );
    if (!updatedExperience) {
      return NextResponse.json({ message: 'Teaching experience not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Teaching experience updated successfully' });
  } catch (error) {
    console.error('Error updating teaching experience:', error);
    return NextResponse.json({ message: 'Failed to update teaching experience' }, { status: 500 });
  }
}

// DELETE - Delete a teaching experience
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedExperience = await TeachingExperience.findOneAndDelete({
      _id: new ObjectId(id),
      userId: HARDCODED_USER_ID
    });
    if (!deletedExperience) {
      return NextResponse.json({ message: 'Teaching experience not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Teaching experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting teaching experience:', error);
    return NextResponse.json({ message: 'Failed to delete teaching experience' }, { status: 500 });
  }
}
