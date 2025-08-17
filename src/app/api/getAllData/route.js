// app/api/getAllData/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import {
  Profile,
  BlogPost,
  TeachingExperience,
  Student,
  Photo,
  Video
} from '@/models/models';

export async function GET() {
  try {
    await dbConnect();
    
    // Get or create the single profile
    let profile = await Profile.findOne({});
    if (!profile) {
      profile = new Profile({
        name: 'Professor Name',
        email: 'professor@university.edu',
        bio: '',
        location: '',
        linkedIn: '',
        profileImage: ''
      });
      await profile.save();
    }

    // Get all data without userId filtering since there's only one user
    const [ blogPosts = [], teachingExperiences = [], students = [], photos = [], videos = [] ] =
      await Promise.all([
        BlogPost.find({}).sort({ createdAt: -1 }).catch(() => []),
        TeachingExperience.find({}).sort({ startDate: -1 }).catch(() => []),
        Student.find({}).sort({ createdAt: -1 }).catch(() => []),
        Photo.find({}).sort({ order: 1, createdAt: -1 }).catch(() => []),
        Video.find({}).sort({ order: 1, createdAt: -1 }).catch(() => []),
      ]);

    const portfolioData = {
      user: profile,
      blogPosts,
      teachingExperiences,
      students,
      photos,
      videos
    };

    console.log(portfolioData);
    return NextResponse.json({ success: true, data: portfolioData });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
