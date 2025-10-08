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

    const totalViews = await AnalyticsEvent.countDocuments({
      timestamp: { $gte: startDate }
    });

    const uniqueVisitors = await AnalyticsEvent.distinct('sessionId', {
      timestamp: { $gte: startDate }
    });

    const avgDuration = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate }, duration: { $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);

    const topPage = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$pagePath', count: { $sum: 1 }, title: { $first: '$pageTitle' } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      avgDuration: avgDuration[0]?.avgDuration || 0,
      topPage: topPage[0] || null
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
