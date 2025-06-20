import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Collaboration } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all collaborations for the user
export async function GET() {
  try {
    await connectDB();
    const collaborations = await Collaboration.find({ userId: HARDCODED_USER_ID }).sort({ startDate: -1 });
    return NextResponse.json(collaborations);
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return NextResponse.json({ message: 'Failed to fetch collaborations' }, { status: 500 });
  }
}

// POST - Create a new collaboration
export async function POST(request) {
  try {
    const data = await request.json();
    const { collaboratorName, institution, projectTitle, startDate, endDate } = data;

    if (!collaboratorName || !projectTitle || !startDate) {
      return NextResponse.json({ message: 'Collaborator Name, Project Title, and Start Date are required' }, { status: 400 });
    }

    await connectDB();
    const newCollaboration = new Collaboration({
      userId: HARDCODED_USER_ID,
      collaboratorName,
      institution,
      projectTitle,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      createdAt: new Date()
    });
    await newCollaboration.save();
    return NextResponse.json({ message: 'Collaboration created successfully', id: newCollaboration._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating collaboration:', error);
    return NextResponse.json({ message: 'Failed to create collaboration' }, { status: 500 });
  }
}
