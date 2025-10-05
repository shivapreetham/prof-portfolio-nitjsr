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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pageStats = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$pagePath',
          title: { $first: '$pageTitle' },
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
          avgDuration: { $avg: '$duration' },
          avgScrollDepth: { $avg: '$scrollDepth' }
        }
      },
      {
        $project: {
          pagePath: '$_id',
          title: 1,
          totalViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgDuration: 1,
          avgScrollDepth: 1
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    return NextResponse.json(pageStats);
  } catch (error) {
    console.error('Error fetching page analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch page analytics' }, { status: 500 });
  }
}
