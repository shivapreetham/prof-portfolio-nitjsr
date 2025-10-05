import { OpinionPiece } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// GET - Fetch single opinion piece
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const opinion = await OpinionPiece.findById(id);

    if (!opinion) {
      return NextResponse.json(
        { error: 'Opinion piece not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(opinion);
  } catch (error) {
    console.error('Error fetching opinion piece:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinion piece' },
      { status: 500 }
    );
  }
}

// PUT - Update opinion piece
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatedOpinion = await OpinionPiece.findByIdAndUpdate(
      id,
      {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        mediaFiles: data.mediaFiles
      },
      { new: true }
    );

    if (!updatedOpinion) {
      return NextResponse.json(
        { error: 'Opinion piece not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOpinion);
  } catch (error) {
    console.error('Error updating opinion piece:', error);
    return NextResponse.json(
      { error: 'Failed to update opinion piece' },
      { status: 500 }
    );
  }
}

// DELETE - Delete opinion piece
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedOpinion = await OpinionPiece.findByIdAndDelete(id);

    if (!deletedOpinion) {
      return NextResponse.json(
        { error: 'Opinion piece not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Opinion piece deleted successfully' });
  } catch (error) {
    console.error('Error deleting opinion piece:', error);
    return NextResponse.json(
      { error: 'Failed to delete opinion piece' },
      { status: 500 }
    );
  }
}
