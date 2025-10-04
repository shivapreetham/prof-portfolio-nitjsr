import { NextResponse } from 'next/server';
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

const normalizePayload = (data) => {
  const authors = sanitizeAuthors(data.authors ?? data.authorsText);
  return {
    title: data.title?.trim(),
    description: data.description?.trim() || undefined,
    category: data.category,
    journalOrConference: data.journalOrConference?.trim() || undefined,
    volume: data.volume?.trim() || undefined,
    pages: data.pages?.trim() || undefined,
    publishedAt: data.publishedAt,
    pdfUrl: data.pdfUrl?.trim() || undefined,
    externalLink: data.externalLink?.trim() || undefined,
    authors,
  };
};

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const filter = { userId: DEFAULT_USER_ID };
    if (category) {
      filter.category = category;
    }

    const papers = await ResearchPaper.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json({ message: 'Failed to fetch research papers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const payload = normalizePayload(data);

    if (!payload.title || !payload.category || !payload.publishedAt) {
      return NextResponse.json({ message: 'Title, category and publication date are required' }, { status: 400 });
    }

    if (!CATEGORY_VALUES.has(payload.category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const publishedDate = new Date(payload.publishedAt);
    if (Number.isNaN(publishedDate.getTime())) {
      return NextResponse.json({ message: 'Invalid publication date' }, { status: 400 });
    }

    await connectDB();

    const paper = new ResearchPaper({
      userId: DEFAULT_USER_ID,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      journalOrConference: payload.journalOrConference,
      volume: payload.volume,
      pages: payload.pages,
      publishedAt: publishedDate,
      pdfUrl: payload.pdfUrl,
      externalLink: payload.externalLink,
      authors: payload.authors,
    });

    await paper.save();

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    console.error('Error creating research paper:', error);
    return NextResponse.json({ message: 'Failed to create research paper' }, { status: 500 });
  }
}
