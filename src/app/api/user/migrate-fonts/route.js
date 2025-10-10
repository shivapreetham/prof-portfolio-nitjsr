import { Profile } from '@/models/models';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

export async function POST(request) {
  try {
    await connectDB();

    const profile = await Profile.findOne({});

    if (!profile) {
      return NextResponse.json(
        { message: 'No profile found' },
        { status: 404 }
      );
    }

    if (!profile.nameFont) {
      profile.nameFont = 'Merriweather';
    }

    if (!profile.overallFont) {
      profile.overallFont = 'Merriweather';
    }

    await profile.save();

    return NextResponse.json({
      message: 'Font fields added successfully',
      profile
    });
  } catch (error) {
    console.error('Error migrating fonts:', error);
    return NextResponse.json(
      { message: 'Failed to migrate fonts', error: error.message },
      { status: 500 }
    );
  }
}
