import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';
// app/api/research-papers/[id]/route.js
export async function PUT(request, { params }) {
    try {
          await connectDB();
      
      const { id } = params;
      const data = await request.json();
      const { title, abstract, pdfUrl, publishedAt } = data;
      
      if (!title || !abstract) {
        return NextResponse.json({ message: 'Title and abstract are required' }, { status: 400 });
      }
      
      const { db } = await connectToDatabase();
      
      const result = await db.collection('researchPapers').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            title,
            abstract,
            pdfUrl,
            publishedAt: new Date(publishedAt),
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Research paper not found' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Research paper updated successfully' });
    } catch (error) {
      console.error('Error updating research paper:', error);
      return NextResponse.json({ message: 'Failed to update research paper' }, { status: 500 });
    }
  }
  
  export async function DELETE(request, { params }) {
    try {
          await connectDB();
      
      const { id } = params;
      
      const { db } = await connectToDatabase();
      
      const result = await db.collection('researchPapers').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: 'Research paper not found' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Research paper deleted successfully' });
    } catch (error) {
      console.error('Error deleting research paper:', error);
      return NextResponse.json({ message: 'Failed to delete research paper' }, { status: 500 });
    }
  }