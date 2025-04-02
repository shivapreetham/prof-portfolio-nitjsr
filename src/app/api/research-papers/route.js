import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { ResearchPaper } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all research papers for the hardcoded user (sorted by publishedAt descending)
export async function GET() {
  try {
    await connectDB();
    const papers = await ResearchPaper.find({ userId: HARDCODED_USER_ID }).sort({ publishedAt: -1 });
    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch research papers' },
      { status: 500 }
    );
  }
}

// POST - Create a new research paper with hardcoded userId
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
    const newPaper = new ResearchPaper({
      userId: HARDCODED_USER_ID,
      title,
      abstract,
      pdfUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdAt: new Date()
    });
    await newPaper.save();
    
    return NextResponse.json(
      { message: 'Research paper created successfully', id: newPaper._id },
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
