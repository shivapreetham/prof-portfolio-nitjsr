import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { Conference } from '@/models/models';

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
    if (typeof data.name === 'string') payload.name = data.name;
    if (typeof data.location === 'string' || data.location === null) payload.location = data.location;
    if (data.date) payload.date = new Date(data.date);
    if (typeof data.paperPresented !== 'undefined') payload.paperPresented = Boolean(data.paperPresented);
    if (typeof data.description === 'string' || data.description === null) payload.description = data.description;
    if (typeof data.links !== 'undefined') {
      payload.links = sanitizeLinks(data.links);
    }

    const updated = await Conference.findOneAndUpdate(
      { _id: new ObjectId(id), userId: DEFAULT_USER_ID },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Conference not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating conference:', error);
    return NextResponse.json({ message: 'Failed to update conference' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Conference.findOneAndDelete({
      _id: new ObjectId(id),
      userId: DEFAULT_USER_ID
    });

    if (!deleted) {
      return NextResponse.json({ message: 'Conference not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    return NextResponse.json({ message: 'Failed to delete conference' }, { status: 500 });
  }
}
