
// app/api/posts/[id]/route.js
import { BlogPost } from '@/models/models';
import connectDB from '@/utils/db';
export async function PUT(request, { params }) {
  try {
      await connectDB();
    
    const { id } = params;
    const data = await request.json();
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!updatedPost) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
        await connectDB();
    
    const { id } = params;
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}