import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/utils/db';

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

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Check if id exists
    if (!id) {
      return NextResponse.json({ message: 'Missing project id' }, { status: 400 });
    }
    
    // Validate the id format
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid project id' }, { status: 400 });
    }
    
    // Delete the project filtering by _id and hardcoded userId
    const deletedProject = await Project.findOneAndDelete({ _id: objectId, userId: HARDCODED_USER_ID });
    
    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    
    // Base URL for API calls (use NEXT_PUBLIC_VERCEL_URL or fallback to localhost)
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

    // Delete associated banner (image) if it exists
    if (deletedProject.banner) {
      try {
        const resBanner = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl: deletedProject.banner })
        });
        const dataBanner = await resBanner.json();
        if (!dataBanner.success) {
          console.warn('Banner deletion failed:', dataBanner.error);
        }
      } catch (err) {
        console.error('Error deleting banner:', err);
      }
    }

    // Delete associated video if it exists
    if (deletedProject.videoUrl) {
      try {
        const resVideo = await fetch(`${baseUrl}/api/cloudFlare/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl: deletedProject.videoUrl })
        });
        const dataVideo = await resVideo.json();
        if (!dataVideo.success) {
          console.warn('Video deletion failed:', dataVideo.error);
        }
      } catch (err) {
        console.error('Error deleting video:', err);
      }
    }
    
    return NextResponse.json({ message: 'Project and associated assets deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  }
}