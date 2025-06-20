import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { Award } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// PUT - Update an award
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const updatedAward = await Award.findOneAndUpdate(
      { _id: new ObjectId(id), userId: HARDCODED_USER_ID },
      data,
      { new: true }
    );
    if (!updatedAward) {
      return NextResponse.json({ message: 'Award not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Award updated successfully' });
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json({ message: 'Failed to update award' }, { status: 500 });
  }
}

// DELETE - Delete an award
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedAward = await Award.findOneAndDelete({
      _id: new ObjectId(id),
      userId: HARDCODED_USER_ID
    });
    if (!deletedAward) {
      return NextResponse.json({ message: 'Award not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Error deleting award:', error);
    return NextResponse.json({ message: 'Failed to delete award' }, { status: 500 });
  }
}
