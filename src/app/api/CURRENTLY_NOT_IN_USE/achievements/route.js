import { Achievement } from '@/models/models';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

// GET - Fetch all achievements for the hardcoded user (sorted by date descending)
export async function GET(request) {
  try {
    await connectDB();
    const achievements = await Achievement.find({ userId: HARDCODED_USER_ID }).sort({ date: -1 });
    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { message: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Create a new achievement with hardcoded userId
export async function POST(request) {
  try {
    await connectDB();
    const { title, description, date } = await request.json();

    // Validate input
    if (!title || !description || !date) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const newAchievement = new Achievement({
      userId: HARDCODED_USER_ID,
      title,
      description,
      date: new Date(date)
    });
    await newAchievement.save();

    return NextResponse.json(
      {
        message: 'Achievement created successfully',
        achievement: newAchievement
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { message: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}
