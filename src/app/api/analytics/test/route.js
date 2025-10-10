import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import { AnalyticsEvent } from '@/models/models';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Create test analytics events to verify tracking is working
    const testEvents = [
      {
        eventType: 'blog_view',
        resourceId: 'test-blog-1',
        resourceTitle: 'Test Blog Post 1',
        pagePath: '/pages/Blogs',
        pageTitle: 'Blog Posts - Professor Portfolio',
        sessionId: `test_session_${Date.now()}`,
        referrer: '',
        timestamp: new Date()
      },
      {
        eventType: 'video_play',
        resourceId: 'test-video-1', 
        resourceTitle: 'Test Video 1',
        pagePath: '/pages/Gallery/VideoGallery',
        pageTitle: 'Video Gallery - Professor Portfolio',
        sessionId: `test_session_${Date.now()}`,
        referrer: '',
        timestamp: new Date()
      },
      {
        eventType: 'paper_view',
        resourceId: 'test-paper-1',
        resourceTitle: 'Test Research Paper 1',
        pagePath: '/pages/ResearchPublications',
        pageTitle: 'Research Publications - Professor Portfolio',
        sessionId: `test_session_${Date.now()}`,
        referrer: '',
        timestamp: new Date()
      },
      {
        eventType: 'student_view',
        resourceId: 'test-student-1',
        resourceTitle: 'Test Student 1',
        resourceType: 'PhD',
        pagePath: '/pages/Students/PhdStudents',
        pageTitle: 'PhD Students - Professor Portfolio',
        sessionId: `test_session_${Date.now()}`,
        referrer: '',
        timestamp: new Date()
      }
    ];

    // Insert test events
    const result = await AnalyticsEvent.insertMany(testEvents);

    return NextResponse.json({
      success: true,
      message: `Created ${result.length} test analytics events`,
      events: result
    });
  } catch (error) {
    console.error('Error creating test analytics:', error);
    return NextResponse.json({ error: 'Failed to create test analytics' }, { status: 500 });
  }
}