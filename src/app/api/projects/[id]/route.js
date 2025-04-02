import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/utils/db';

// GET, PUT, DELETE for individual projects can also filter by userId if desired
export async function GET_BY_ID(request, { params }) {
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

export async function PUT_BY_ID(request, { params }) {
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

export async function DELETE_BY_ID(request, { params }) {
  try {
    await connectDB();
    const deletedProject = await Project.findOneAndDelete({ _id: params.id, userId: HARDCODED_USER_ID });
    if (!deletedProject) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
