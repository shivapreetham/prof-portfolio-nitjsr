import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/utils/db';
import { AnalyticsEvent } from '@/models/models';

export async function DELETE(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Delete all analytics events with generic titles like "KK sir"
    const result = await AnalyticsEvent.deleteMany({
      $or: [
        { pageTitle: "KK sir" },
        { pageTitle: { $regex: /^KK\s+sir$/i } },
        { pageTitle: { $not: { $regex: /Professor Portfolio/ } } }
      ]
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} old analytics entries`
    });
  } catch (error) {
    console.error('Error cleaning analytics:', error);
    return NextResponse.json({ error: 'Failed to clean analytics' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Show count of entries by page title
    const titleCounts = await AnalyticsEvent.aggregate([
      {
        $group: {
          _id: '$pageTitle',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      titleCounts,
      totalEntries: await AnalyticsEvent.countDocuments()
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics summary' }, { status: 500 });
  }
}