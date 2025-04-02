// app/api/posts/route.js
import { BlogPost } from '@/models/models';
import { Response } from 'next/server';
import connectDB from '@/utils/db';
export async function GET() {
  try {
        await connectDB();
    
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
        await connectDB();
    
    const data = await request.json();
    
    const newPost = new BlogPost({
      userId: data.userId || "1",
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null
    });
    
    await newPost.save();
    return Response.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
