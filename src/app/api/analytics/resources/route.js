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
    const type = searchParams.get('type');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchQuery = {
      timestamp: { $gte: startDate },
      resourceId: { $exists: true, $ne: null }
    };

    if (type) {
      matchQuery.eventType = type;
    }

    const resourceStats = await AnalyticsEvent.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            resourceId: '$resourceId',
            eventType: '$eventType'
          },
          title: { $first: '$resourceTitle' },
          resourceType: { $first: '$resourceType' },
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $project: {
          resourceId: '$_id.resourceId',
          eventType: '$_id.eventType',
          title: 1,
          resourceType: 1,
          totalViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgDuration: 1
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 50 }
    ]);

    const summary = await AnalyticsEvent.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      resources: resourceStats,
      summary: summary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching resource analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch resource analytics' }, { status: 500 });
  }
}
