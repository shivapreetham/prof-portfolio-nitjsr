import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { Award } from '@/models/models';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '67ed468b5b281d81f91a0a78';

const sanitizeLinks = (links) => {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .map((link) => (typeof link === 'string' ? link.trim() : ''))
      .filter(Boolean);
  }
  if (typeof links === 'string') {
    return links
      .split('\n')
      .map((link) => link.trim())
      .filter(Boolean);
  }
  return [];
};

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const payload = {};
    if (typeof data.title === 'string') payload.title = data.title;
    if (typeof data.organization === 'string' || data.organization === null) payload.organization = data.organization;
    if (data.date) payload.date = new Date(data.date);
    if (typeof data.description === 'string' || data.description === null) payload.description = data.description;
    if (typeof data.links !== 'undefined') {
      payload.links = sanitizeLinks(data.links);
    }

    const updatedAward = await Award.findOneAndUpdate(
      { _id: new ObjectId(id), userId: DEFAULT_USER_ID },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedAward) {
      return NextResponse.json({ message: 'Award not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAward);
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json({ message: 'Failed to update award' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedAward = await Award.findOneAndDelete({
      _id: new ObjectId(id),
      userId: DEFAULT_USER_ID
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
