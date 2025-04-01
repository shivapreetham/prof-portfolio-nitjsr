
// File: /app/api/achievements/[id]/route.js
import { Achievement } from '@/models/models';
import { NextResponse } from 'next/server';

// PUT - Update an existing achievement
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
    
    // Find and update the achievement
    const updatedAchievement = await Achievement.findOneAndUpdate(
      { _id: id, userId }, // Ensure user only updates their own achievements
      {
        title,
        description,
        date: new Date(date)
      },
      { new: true }
    );
    
    if (!updatedAchievement) {
      return NextResponse.json(
        { message: 'Achievement not found or you do not have permission' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Achievement updated successfully',
      achievement: updatedAchievement
    });
    
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { message: 'Failed to update achievement' }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove an achievement
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get user ID from session (implement auth)
    const userId = "1";
    
    // Find and delete the achievement
    const achievement = await Achievement.findOneAndDelete({ 
      _id: id, 
      userId 
    });
    
    if (!achievement) {
      return NextResponse.json(
        { message: 'Achievement not found or you do not have permission' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Achievement deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { message: 'Failed to delete achievement' }, 
      { status: 500 }
    );
  }
}