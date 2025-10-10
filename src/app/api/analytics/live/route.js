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

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const activeSessions = await AnalyticsEvent.distinct('sessionId', {
      eventType: 'page_view',
      timestamp: { $gte: fiveMinutesAgo }
    });

    const recentPageViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'page_view',
          timestamp: { $gte: fiveMinutesAgo }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$sessionId',
          lastPage: { $first: '$pagePath' },
          lastSeen: { $first: '$timestamp' },
          device: { $first: '$device' }
        }
      },
      {
        $project: {
          sessionId: '$_id',
          lastPage: 1,
          lastSeen: 1,
          device: 1,
          _id: 0
        }
      },
      { $limit: 10 }
    ]);

    return NextResponse.json({
      liveViewers: activeSessions.length,
      activeUsers: recentPageViews
    });
  } catch (error) {
    console.error('Error fetching live viewers:', error);
    return NextResponse.json({ error: 'Failed to fetch live viewers' }, { status: 500 });
  }
}
