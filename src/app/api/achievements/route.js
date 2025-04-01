// File: /app/api/achievements/route.js
import { Achievement } from '@/models/models';
import { NextResponse } from 'next/server';

// POST - Create a new achievement
export async function GET(request) {
    try {
      // Get user ID from session (implement auth)
      const userId = "1";
      
      // Fetch achievements sorted by date descending
      const achievements = await Achievement.find({ userId })
        .sort({ date: -1 });
      
      return NextResponse.json({
        achievements
      });
      
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return NextResponse.json(
        { message: 'Failed to fetch achievements' }, 
        { status: 500 }
      );
    }
  }
export async function POST(request) {
  try {
    const { title, description, date } = await request.json();
    
    // Validate input
    if (!title || !description || !date) {
      return NextResponse.json(
        { message: 'All fields are required' }, 
        { status: 400 }
      );
    }
    
    // Get user ID from session (implement auth)
    // Using hardcoded ID for now
    const userId = "1";
    
    // Create achievement
    const newAchievement = new Achievement({
      userId,
      title,
      description,
      date: new Date(date)
    });
    
    await newAchievement.save();
    
    return NextResponse.json({
      message: 'Achievement created successfully',
      achievement: newAchievement
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { message: 'Failed to create achievement' }, 
      { status: 500 }
    );
  }
}
