import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { ResearchPaper } from '@/models/models';
const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

export async function PUT(request, { params }) {
  try {
    // Ensure connection is established
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const { title, abstract, pdfUrl, publishedAt } = data;

    if (!title || !abstract) {
      return NextResponse.json(
        { message: 'Title and abstract are required' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const result = await ResearchPaper.updateOne(
      { _id: new ObjectId(id), userId: HARDCODED_USER_ID },
      {
        $set: {
          title,
          abstract,
          pdfUrl,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Research paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Research paper updated successfully' });
  } catch (error) {
    console.error('Error updating research paper:', error);
    return NextResponse.json(
      { message: 'Failed to update research paper' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { db } = await connectDB();
    const result = await ResearchPaper.deleteOne({
      _id: new ObjectId(id),
      userId: HARDCODED_USER_ID
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Research paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Research paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting research paper:', error);
    return NextResponse.json(
      { message: 'Failed to delete research paper' },
      { status: 500 }
    );
  }
}
