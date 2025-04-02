import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import {
  User,
  Project,
  ResearchPaper,
  Conference,
  Achievement,
  BlogPost,
  TeachingExperience,
  Award,
  Collaboration
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
      projects = [],
      researchPapers = [],
      conferences = [],
      achievements = [],
      blogPosts = [],
      teachingExperiences = [],
      awards = [],
      collaborations = []
    ] = await Promise.all([
      Project.find({ userId }).catch(() => []),
      ResearchPaper.find({ userId }).sort({ publishedAt: -1 }).catch(() => []),
      Conference.find({ userId }).sort({ date: -1 }).catch(() => []),
      Achievement.find({ userId }).sort({ date: -1 }).catch(() => []),
      BlogPost.find({ userId }).sort({ createdAt: -1 }).catch(() => []),
      TeachingExperience.find({ userId }).sort({ startDate: -1 }).catch(() => []),
      Award.find({ userId }).sort({ date: -1 }).catch(() => []),
      Collaboration.find({ userId }).sort({ startDate: -1 }).catch(() => [])
    ]);

    // Compile all data
    const portfolioData = {
      user,
      projects,
      researchPapers,
      conferences,
      achievements,
      blogPosts,
      teachingExperiences,
      awards,
      collaborations
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
