import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { Collaboration } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// PUT - Update a collaboration
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const updatedCollaboration = await Collaboration.findOneAndUpdate(
      { _id: new ObjectId(id), userId: HARDCODED_USER_ID },
      data,
      { new: true }
    );
    if (!updatedCollaboration) {
      return NextResponse.json({ message: 'Collaboration not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Collaboration updated successfully' });
  } catch (error) {
    console.error('Error updating collaboration:', error);
    return NextResponse.json({ message: 'Failed to update collaboration' }, { status: 500 });
  }
}

// DELETE - Delete a collaboration
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedCollaboration = await Collaboration.findOneAndDelete({
      _id: new ObjectId(id),
      userId: HARDCODED_USER_ID
    });
    if (!deletedCollaboration) {
      return NextResponse.json({ message: 'Collaboration not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Collaboration deleted successfully' });
  } catch (error) {
    console.error('Error deleting collaboration:', error);
    return NextResponse.json({ message: 'Failed to delete collaboration' }, { status: 500 });
  }
}
