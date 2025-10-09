import { Profile } from '@/models/models';
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
    const allowedFields = [
      'name',
      'email',
      'bio',
      'location',
      'linkedIn',
      'phoneNumber',
      'designation1',
      'designation2',
      'designation3',
      'bannerImages'
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { message: `Field "${field}" cannot be updated.` },
        { status: 400 }
      );
    }

    // Find or create the single profile (since there's only one user)
    let profile = await Profile.findOne({});

    if (!profile) {
      // Create profile if it doesn't exist with the initial field value
      const initialData = {
        name: field === 'name' ? value : 'Professor Name',
        email: field === 'email' ? value : 'professor@university.edu',
        bio: field === 'bio' ? value : '',
        location: field === 'location' ? value : '',
        linkedIn: field === 'linkedIn' ? value : '',
        phoneNumber: field === 'phoneNumber' ? value : '',
        designation1: field === 'designation1' ? value : '',
        designation2: field === 'designation2' ? value : '',
        designation3: field === 'designation3' ? value : '',
        bannerImages: field === 'bannerImages' ? value : [] // Default empty array for bannerImages
      };
      
      profile = new Profile(initialData);
      await profile.save({ runValidators: true });
    } else {
      // Update the existing profile field
      profile[field] = value;
      await profile.save({ runValidators: true });
    }

    return NextResponse.json({
      message: 'Profile updated successfully.',
      user: profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
