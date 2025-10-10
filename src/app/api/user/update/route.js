import { Profile } from '@/models/models';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

export async function PATCH(request) {
  try {
    await connectDB();
    const { field, value } = await request.json();

    console.log('=== UPDATE REQUEST ===');
    console.log('Field:', field);
    console.log('Value:', value);

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
      'bannerImages',
      'nameFont',
      'overallFont'
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
      console.log('Before update:', profile[field]);
      profile[field] = value;
      profile.markModified(field);
      console.log('After update (before save):', profile[field]);
      await profile.save({ runValidators: true });
      console.log('After save:', profile[field]);

      // Verify the update
      const updatedProfile = await Profile.findOne({});
      console.log('Fetched from DB:', updatedProfile[field]);
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
