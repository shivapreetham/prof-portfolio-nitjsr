// File: /app/api/projects/route.js
import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const newProject = new Project({
      userId: data.userId,
      title: data.title,
      description: data.description,
      collaborators: data.collaborators || null,
      videoUrl: data.videoUrl || null,
      banner: data.banner || null
    });
    
    await newProject.save();
    return NextResponse.json(
      { message: 'Project created successfully', project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Failed to create project' },
      { status: 500 }
    );
  }
}