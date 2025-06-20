import { NextResponse } from 'next/server';
import { Project } from '@/models/models';
import connectDB from '@/utils/db';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all projects for the hardcoded user (sorted by createdAt descending)
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({ userId: HARDCODED_USER_ID }).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create a new project with hardcoded userId
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newProject = new Project({
      userId: HARDCODED_USER_ID,
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
