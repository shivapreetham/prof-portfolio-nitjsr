// app/api/research-papers/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const papers = await db.collection('researchPapers').find({}).sort({ publishedAt: -1 }).toArray();
    
    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json({ message: 'Failed to fetch research papers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, abstract, pdfUrl, publishedAt } = data;
    
    if (!title || !abstract) {
      return NextResponse.json({ message: 'Title and abstract are required' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection('researchPapers').insertOne({
      title,
      abstract,
      pdfUrl,
      publishedAt: new Date(publishedAt),
      createdAt: new Date()
    });
    
    return NextResponse.json({ message: 'Research paper created successfully', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating research paper:', error);
    return NextResponse.json({ message: 'Failed to create research paper' }, { status: 500 });
  }
}
