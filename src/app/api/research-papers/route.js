import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { ResearchPaper } from '@/models/models';
export async function GET() {
  try {
    await connectDB();
    const papers = await ResearchPaper.find({}).sort({ createdAt: -1 });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch research papers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, abstract, pdfUrl, publishedAt } = data;

    if (!title || !abstract) {
      return NextResponse.json(
        { message: 'Title and abstract are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await ResearchPaper.insertOne({
      title,
      abstract,
      pdfUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'Research paper created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating research paper:', error);
    return NextResponse.json(
      { message: 'Failed to create research paper' },
      { status: 500 }
    );
  }
}
