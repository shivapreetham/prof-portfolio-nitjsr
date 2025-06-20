// app/api/getAllData/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import {
  User,
  BlogPost,
  TeachingExperience,
  Student 
} from '@/models/models';

export async function GET() {
  try {
    await dbConnect();
    const user = await User.findOne({});
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Professor data not found' },
        { status: 404 }
      );
    }
    const userId = user._id;

    const [ blogPosts = [], teachingExperiences = [], students = [] ] =
      await Promise.all([
        BlogPost.find({ userId }).sort({ createdAt: -1 }).catch(() => []),
        TeachingExperience.find({ userId }).sort({ startDate: -1 }).catch(() => []),
        Student.find({ teacherId: userId }).sort({ createdAt: -1 }).catch(() => []),
      ]);

    const portfolioData = {
      user,
      blogPosts,
      teachingExperiences,
      students     
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
