import { BlogPost } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    // Await params to ensure it’s resolved before destructuring
    const { id } = await params;
    const data = await request.json();

    // Remove userId from the payload to avoid conflicts
    if (data.userId) {
      delete data.userId;
    }

    const postId = new ObjectId(id);
    const userObjectId = new ObjectId(HARDCODED_USER_ID);

    const updatedPost = await BlogPost.findOneAndUpdate(
      { _id: postId, userId: userObjectId },
      data,
      { new: true }
    );
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const postId = new ObjectId(id);
    const userObjectId = new ObjectId(HARDCODED_USER_ID);

    const deletedPost = await BlogPost.findOneAndDelete({
      _id: postId,
      userId: userObjectId
    });
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
