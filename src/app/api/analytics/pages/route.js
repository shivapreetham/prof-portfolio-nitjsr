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
      { $match: { eventType: 'page_view', timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$pagePath',
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
          avgDuration: { $avg: '$duration' },
          avgScrollDepth: { $avg: '$scrollDepth' }
        }
      },
      {
        $project: {
          pagePath: '$_id',
          totalViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgDuration: 1,
          avgScrollDepth: 1
        }
      },
      { $sort: { totalViews: -1 } }
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

    const formattedStats = pageStats.map(stat => ({
      ...stat,
      title: formatPageTitle(stat.pagePath)
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Error fetching page analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch page analytics' }, { status: 500 });
  }
}
