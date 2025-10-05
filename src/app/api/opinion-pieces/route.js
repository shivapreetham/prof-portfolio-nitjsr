import { OpinionPiece } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// GET - Fetch all opinion pieces (sorted by createdAt descending)
export async function GET() {
  try {
    await connectDB();
    const opinions = await OpinionPiece.find({}).sort({ createdAt: -1 });
    return NextResponse.json(opinions);
  } catch (error) {
    console.error('Error fetching opinion pieces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinion pieces' },
      { status: 500 }
    );
  }
}

// POST - Create a new opinion piece
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newOpinion = new OpinionPiece({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null,
      mediaFiles: data.mediaFiles || []
    });
    await newOpinion.save();

    return NextResponse.json(newOpinion, { status: 201 });
  } catch (error) {
    console.error('Error creating opinion piece:', error);
    return NextResponse.json(
      { error: 'Failed to create opinion piece' },
      { status: 500 }
    );
  }
}
