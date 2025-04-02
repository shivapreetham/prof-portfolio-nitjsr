import { BlogPost } from '@/models/models';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all blog posts for the hardcoded user (sorted by createdAt descending)
export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ userId: HARDCODED_USER_ID }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post with hardcoded userId
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newPost = new BlogPost({
      userId: HARDCODED_USER_ID,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null
    });
    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT and DELETE routes for individual posts remain unchanged
