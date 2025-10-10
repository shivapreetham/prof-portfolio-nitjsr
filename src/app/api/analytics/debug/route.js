import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import { AnalyticsEvent } from '@/models/models';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get recent analytics events for debugging
    const recentEvents = await AnalyticsEvent.find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .select('pagePath pageTitle eventType timestamp sessionId');

    // Get unique page titles
    const uniqueTitles = await AnalyticsEvent.distinct('pageTitle');

    return NextResponse.json({
      recentEvents,
      uniqueTitles,
      totalEvents: await AnalyticsEvent.countDocuments()
    });
  } catch (error) {
    console.error('Error fetching debug analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch debug analytics' }, { status: 500 });
  }
}