import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/db';
import { FundedProject } from '@/models/models';

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '67ed468b5b281d81f91a0a78';

const sanitizeLinks = (links) => {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .map((link) => (typeof link === 'string' ? link.trim() : ''))
      .filter(Boolean);
  }
  if (typeof links === 'string') {
    return links
      .split('\n')
      .map((link) => link.trim())
      .filter(Boolean);
  }
  return [];
};

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const payload = {};
    if (typeof data.title === 'string') payload.title = data.title;
    if (typeof data.role === 'string' || data.role === null) payload.role = data.role;
    if (typeof data.fundingAgency === 'string') payload.fundingAgency = data.fundingAgency;
    if (typeof data.amount === 'string' || data.amount === null) payload.amount = data.amount;
    if (typeof data.duration === 'string' || data.duration === null) payload.duration = data.duration;
    if (typeof data.projectType === 'string') payload.projectType = data.projectType;
    if (typeof data.description === 'string' || data.description === null) payload.description = data.description;
    if (typeof data.collaborators === 'string' || data.collaborators === null) payload.collaborators = data.collaborators;
    if (typeof data.status === 'string') payload.status = data.status;
    if (typeof data.links !== 'undefined') {
      payload.links = sanitizeLinks(data.links);
    }

    const updatedProject = await FundedProject.findOneAndUpdate(
      { _id: new ObjectId(id), userId: DEFAULT_USER_ID },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ message: 'Funded project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating funded project:', error);
    return NextResponse.json({ message: 'Failed to update funded project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedProject = await FundedProject.findOneAndDelete({
      _id: new ObjectId(id),
      userId: DEFAULT_USER_ID
    });

    if (!deletedProject) {
      return NextResponse.json({ message: 'Funded project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Funded project deleted successfully' });
  } catch (error) {
    console.error('Error deleting funded project:', error);
    return NextResponse.json({ message: 'Failed to delete funded project' }, { status: 500 });
  }
}
