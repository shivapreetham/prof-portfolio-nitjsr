import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await connectDB();
    const projects = await FundedProject.find({ userId: DEFAULT_USER_ID }).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching funded projects:', error);
    return NextResponse.json({ message: 'Failed to fetch funded projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, fundingAgency, role, amount, duration, projectType, description, collaborators, status } = data;

    if (!title || !fundingAgency) {
      return NextResponse.json({ message: 'Title and funding agency are required' }, { status: 400 });
    }

    await connectDB();

    const project = new FundedProject({
      userId: DEFAULT_USER_ID,
      title,
      fundingAgency,
      role,
      amount,
      duration,
      projectType: projectType || 'Sponsored',
      description,
      collaborators,
      status: status || 'Ongoing',
      links: sanitizeLinks(data.links)
    });

    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating funded project:', error);
    return NextResponse.json({ message: 'Failed to create funded project' }, { status: 500 });
  }
}
