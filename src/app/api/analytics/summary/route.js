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

    // Previous period for comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (days * 2));
    const previousEndDate = new Date();
    previousEndDate.setDate(previousEndDate.getDate() - days);

    // Current period metrics
    const totalViews = await AnalyticsEvent.countDocuments({
      timestamp: { $gte: startDate }
    });

    // Unique visitors in current period
    const uniqueVisitors = await AnalyticsEvent.distinct('sessionId', {
      timestamp: { $gte: startDate }
    });

    // Previous period metrics for comparison
    const previousViews = await AnalyticsEvent.countDocuments({
      timestamp: { $gte: previousStartDate, $lt: previousEndDate }
    });

    const previousUniqueVisitors = await AnalyticsEvent.distinct('sessionId', {
      timestamp: { $gte: previousStartDate, $lt: previousEndDate }
    });

    // Daily average unique visitors
    const dailyVisitors = await AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          uniqueVisitors: { $addToSet: '$sessionId' }
        }
      },
      {
        $project: {
          date: '$_id',
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      }
    ]);

    const avgDailyVisitors = dailyVisitors.length > 0 
      ? Math.round(dailyVisitors.reduce((sum, day) => sum + day.uniqueVisitors, 0) / dailyVisitors.length)
      : 0;

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

    // Calculate growth percentages
    const viewsGrowth = previousViews > 0 
      ? Math.round(((totalViews - previousViews) / previousViews) * 100)
      : 0;
    
    const visitorsGrowth = previousUniqueVisitors.length > 0 
      ? Math.round(((uniqueVisitors.length - previousUniqueVisitors.length) / previousUniqueVisitors.length) * 100)
      : 0;

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      avgDailyVisitors,
      avgDuration: avgDuration[0]?.avgDuration || 0,
      topPage: topPage[0] || null,
      growth: {
        views: viewsGrowth,
        visitors: visitorsGrowth
      },
      comparison: {
        currentPeriod: {
          views: totalViews,
          visitors: uniqueVisitors.length
        },
        previousPeriod: {
          views: previousViews,
          visitors: previousUniqueVisitors.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
