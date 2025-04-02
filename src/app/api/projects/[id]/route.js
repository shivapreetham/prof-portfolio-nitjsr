import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/utils/db';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const project = await Project.findById(params.id);
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

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
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
    const deletedProject = await Project.findByIdAndDelete(params.id);
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
