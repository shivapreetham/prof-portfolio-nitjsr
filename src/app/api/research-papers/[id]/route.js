import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { ResearchPaper } from '@/models/models';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '67ed468b5b281d81f91a0a78';
const CATEGORY_VALUES = new Set([
  'International Journal Papers',
  'International Conference Papers',
  'Books'
]);

const sanitizeAuthors = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((author) => (typeof author === 'string' ? author.trim() : '')).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/\n|,/)
      .map((author) => author.trim())
      .filter(Boolean);
  }
  return [];
};

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatePayload = {};

    if (typeof data.title === 'string') updatePayload.title = data.title.trim();
    if (typeof data.description === 'string' || data.description === null) updatePayload.description = data.description?.trim() || undefined;
    if (typeof data.category === 'string') {
      if (!CATEGORY_VALUES.has(data.category)) {
        return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
      }
      updatePayload.category = data.category;
    }
    if (typeof data.journalOrConference === 'string' || data.journalOrConference === null) {
      updatePayload.journalOrConference = data.journalOrConference?.trim() || undefined;
    }
    if (typeof data.volume === 'string' || data.volume === null) updatePayload.volume = data.volume?.trim() || undefined;
    if (typeof data.pages === 'string' || data.pages === null) updatePayload.pages = data.pages?.trim() || undefined;
    if (data.publishedAt) {
      const publishedDate = new Date(data.publishedAt);
      if (Number.isNaN(publishedDate.getTime())) {
        return NextResponse.json({ message: 'Invalid publication date' }, { status: 400 });
      }
      updatePayload.publishedAt = publishedDate;
    }
    if (typeof data.pdfUrl === 'string' || data.pdfUrl === null) updatePayload.pdfUrl = data.pdfUrl?.trim() || undefined;
    if (typeof data.externalLink === 'string' || data.externalLink === null) updatePayload.externalLink = data.externalLink?.trim() || undefined;
    if (typeof data.authors !== 'undefined' || typeof data.authorsText !== 'undefined') {
      updatePayload.authors = sanitizeAuthors(data.authors ?? data.authorsText);
    }

    const updated = await ResearchPaper.findOneAndUpdate(
      { _id: new ObjectId(id), userId: DEFAULT_USER_ID },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Research paper not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating research paper:', error);
    return NextResponse.json({ message: 'Failed to update research paper' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await ResearchPaper.findOneAndDelete({
      _id: new ObjectId(id),
      userId: DEFAULT_USER_ID
    });

    if (!deleted) {
      return NextResponse.json({ message: 'Research paper not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Research paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting research paper:', error);
    return NextResponse.json({ message: 'Failed to delete research paper' }, { status: 500 });
  }
}
