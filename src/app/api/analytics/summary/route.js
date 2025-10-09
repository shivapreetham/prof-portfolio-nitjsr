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

    // Current period metrics - only count page_view events
    const totalViews = await AnalyticsEvent.countDocuments({
      eventType: 'page_view',
      timestamp: { $gte: startDate }
    });

    // Unique visitors in current period
    const uniqueVisitors = await AnalyticsEvent.distinct('sessionId', {
      eventType: 'page_view',
      timestamp: { $gte: startDate }
    });

    // Previous period metrics for comparison
    const previousViews = await AnalyticsEvent.countDocuments({
      eventType: 'page_view',
      timestamp: { $gte: previousStartDate, $lt: previousEndDate }
    });

    const previousUniqueVisitors = await AnalyticsEvent.distinct('sessionId', {
      eventType: 'page_view',
      timestamp: { $gte: previousStartDate, $lt: previousEndDate }
    });

    // Daily average unique visitors
    const dailyVisitors = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', timestamp: { $gte: startDate } } },
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
      { $match: { eventType: 'page_view', timestamp: { $gte: startDate }, duration: { $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);

    const topPage = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', timestamp: { $gte: startDate } } },
      { $group: { _id: '$pagePath', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    function formatPageTitle(path) {
      if (path === '/') return 'Home';
      if (path.startsWith('/pages/')) {
        const segments = path.split('/').filter(Boolean);
        const pageName = segments[segments.length - 1];
        return pageName.replace(/([A-Z])/g, ' $1').trim();
      }
      if (path.startsWith('/admin')) {
        if (path.includes('dashboard')) return 'Admin Dashboard';
        return 'Admin Panel';
      }
      if (path.startsWith('/login')) return 'Login';
      return path.split('/').filter(Boolean).pop() || 'Unknown';
    }

    // Calculate growth percentages
    const viewsGrowth = previousViews > 0
      ? Math.round(((totalViews - previousViews) / previousViews) * 100)
      : 0;

    const visitorsGrowth = previousUniqueVisitors.length > 0
      ? Math.round(((uniqueVisitors.length - previousUniqueVisitors.length) / previousUniqueVisitors.length) * 100)
      : 0;

    const topPageFormatted = topPage[0] ? {
      ...topPage[0],
      title: formatPageTitle(topPage[0]._id)
    } : null;

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      avgDailyVisitors,
      avgDuration: avgDuration[0]?.avgDuration || 0,
      topPage: topPageFormatted,
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
