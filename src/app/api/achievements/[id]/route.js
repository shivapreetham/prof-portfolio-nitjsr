import { Achievement } from '@/models/models';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

const HARDCODED_USER_ID = "67ed468b5b281d81f91a0a78";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { title, description, date } = await request.json();
    
    // Validate input
    if (!title || !description || !date) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Update achievement filtering by _id and hardcoded userId
    const updatedAchievement = await Achievement.findOneAndUpdate(
      { _id: id, userId: HARDCODED_USER_ID },
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

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    // Delete achievement filtering by _id and hardcoded userId
    const achievement = await Achievement.findOneAndDelete({ 
      _id: id, 
      userId: HARDCODED_USER_ID
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
