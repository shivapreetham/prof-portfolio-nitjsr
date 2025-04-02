import { User } from '@/models/models';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

export async function PATCH(request) {
  try {
    await connectDB();
    const { field, value } = await request.json();

    // Validate input
    if (!field || value === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: "field" and "value" are required.' },
        { status: 400 }
      );
    }

    // Validate that the field is allowed to be updated
    const allowedFields = ['name', 'email', 'bio', 'location', 'linkedIn', 'profileImage'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { message: `Field "${field}" cannot be updated.` },
        { status: 400 }
      );
    }

    // Use the hardcoded user ID
    const userId = "67ed468b5b281d81f91a0a78";

    // Update the user and run model validators
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: value },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user.' },
      { status: 500 }
    );
  }
}
