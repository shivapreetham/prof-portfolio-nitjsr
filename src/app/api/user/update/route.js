// File: /app/api/user/update/route.js
import { User } from '@/models/models';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  try {
    const { field, value } = await request.json();
    
    // Validate input
    if (!field || value === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Validate field is allowed to be updated
    const allowedFields = ['name', 'email', 'bio', 'location', 'linkedIn', 'profileImage'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { message: 'Field cannot be updated' }, 
        { status: 400 }
      );
    }
    
    // Get user ID from session (you'll need to implement auth)
    // For now, using the hardcoded ID from your original code
    const userId = "1"; // In production, this should come from auth
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: value },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' }, 
      { status: 500 }
    );
  }
}