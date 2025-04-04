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
      userId: userObjectId,
    });

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If an imageUrl exists, call the Cloudflare deletion API endpoint
    if (deletedPost.imageUrl) {
      try {
        // Construct the absolute URL for the API endpoint.
        // Use NEXT_PUBLIC_VERCEL_URL or fallback to localhost for local development.
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: deletedPost.imageUrl }),
        });
        const data = await res.json();
        if (!data.success) {
          console.warn('Cloudflare image deletion failed:', data.error);
        }
        console.log('Cloudflare image deletion response:', data);
      } catch (err) {
        console.error('Error calling Cloudflare deletion API:', err);
      }
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
