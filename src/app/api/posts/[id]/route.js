import { BlogPost } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    // Await params to ensure it's resolved before destructuring
    const { id } = await params;
    const data = await request.json();

    const postId = new ObjectId(id);

    const updatedPost = await BlogPost.findOneAndUpdate(
      { _id: postId },
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

    const deletedPost = await BlogPost.findOneAndDelete({
      _id: postId,
    });

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete all media files
    const mediaUrls = [];
    if (deletedPost.imageUrl) {
      mediaUrls.push(deletedPost.imageUrl);
    }
    if (deletedPost.mediaFiles && deletedPost.mediaFiles.length > 0) {
      mediaUrls.push(...deletedPost.mediaFiles.map(file => file.url));
    }

    // Call the Cloudflare deletion API endpoint for each media file
    for (const mediaUrl of mediaUrls) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: mediaUrl }),
        });
        const data = await res.json();
        if (!data.success) {
          console.warn('Cloudflare media deletion failed:', data.error);
        }
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
