import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await connectDB();
    const awards = await Award.find({ userId: DEFAULT_USER_ID }).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ message: 'Failed to fetch awards' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, date, organization, description = '' } = data;

    if (!title || !date) {
      return NextResponse.json({ message: 'Title and date are required' }, { status: 400 });
    }

    await connectDB();

    const award = new Award({
      userId: DEFAULT_USER_ID,
      title,
      organization,
      date: new Date(date),
      description,
      links: sanitizeLinks(data.links)
    });

    await award.save();

    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json({ message: 'Failed to create award' }, { status: 500 });
  }
}
