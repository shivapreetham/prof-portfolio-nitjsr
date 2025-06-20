import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/utils/db';
import mongoose from 'mongoose';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch a project by ID for the hardcoded user
export async function GET(request, { params }) {
  try {
    await connectDB();
    const project = await Project.findOne({ _id: params.id, userId: HARDCODED_USER_ID });
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update a project by ID for the hardcoded user
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid project id' }, { status: 400 });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: params.id, userId: HARDCODED_USER_ID },
      {
        title: data.title,
        description: data.description,
        collaborators: data.collaborators || null,
        videoUrl: data.videoUrl || null,
        banner: data.banner || null
      },
      { new: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const id = params.id;
    
    // Check if id exists
    if (!id) {
      return NextResponse.json({ message: 'Missing project id' }, { status: 400 });
    }
    
    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid project id' }, { status: 400 });
    }
    
    // Delete the project filtering by _id and hardcoded userId
    const deletedProject = await Project.findOneAndDelete({ 
      _id: id, 
      userId: HARDCODED_USER_ID 
    });
    
    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    
    // Base URL for API calls (use NEXT_PUBLIC_VERCEL_URL or fallback to localhost)
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

    for (const url of [deletedProject.banner, deletedProject.videoUrl]) {
      if (!url) continue;
      try {
        const res = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url })
        });
        const data = await res.json();
        console.log(`Delete ${url}:`, data);
        if (!data.success) console.warn('Deletion failed:', data.error);
      } catch (err) {
        console.error(`Error deleting ${url}:`, err);
      }
    }
    
    return NextResponse.json({ message: 'Project and associated assets deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  }
}