import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Award } from '@/models/models';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all awards for the user
export async function GET() {
  try {
    await connectDB();
    const awards = await Award.find({ userId: HARDCODED_USER_ID }).sort({ date: -1 });
    return NextResponse.json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ message: 'Failed to fetch awards' }, { status: 500 });
  }
}

// POST - Create a new award
export async function POST(request) {
  try {
    const data = await request.json();
    const { title, organization, date } = data;

    if (!title || !organization || !date) {
      return NextResponse.json({ message: 'Title, organization, and date are required' }, { status: 400 });
    }

    await connectDB();
    const newAward = new Award({
      userId: HARDCODED_USER_ID,
      title,
      organization,
      date: new Date(date),
      createdAt: new Date()
    });
    await newAward.save();
    return NextResponse.json({ message: 'Award created successfully', id: newAward._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json({ message: 'Failed to create award' }, { status: 500 });
  }
}
