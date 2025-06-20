import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import {
  User,
  BlogPost,
  TeachingExperience,
} from '@/models/models';

// Export GET method handler
export async function GET() {
  try {
    await dbConnect();
    // Get the first (and only) user
    const user = await User.findOne({});
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Professor data not found' },
        { status: 404 }
      );
    }
    const userId = user._id;
    // Fetch all data and ensure empty arrays are returned if no records exist
    const [
      blogPosts = [],
      teachingExperiences = [],
    ] = await Promise.all([
      BlogPost.find({ userId }).sort({ createdAt: -1 }).catch(() => []),
      TeachingExperience.find({ userId }).sort({ startDate: -1 }).catch(() => []),
    ]);
    // Compile all data
    const portfolioData = {
      user,
      blogPosts,
      teachingExperiences,
    };
    console.log(portfolioData)
    return NextResponse.json({ success: true, data: portfolioData });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
