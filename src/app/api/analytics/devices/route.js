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

    const deviceStats = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const browserStats = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const osStats = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      devices: deviceStats,
      browsers: browserStats,
      operatingSystems: osStats
    });
  } catch (error) {
    console.error('Error fetching device analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch device analytics' }, { status: 500 });
  }
}
