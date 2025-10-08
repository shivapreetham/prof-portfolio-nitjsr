import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { AnalyticsEvent, EVENT_TYPES, DEVICE_TYPES } from '@/models/models';
import crypto from 'crypto';

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function detectDevice(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function detectBrowser(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Other';
}

function detectOS(userAgent) {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Other';
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.eventType || !EVENT_TYPES.includes(data.eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    if (!data.pagePath || !data.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const event = new AnalyticsEvent({
      eventType: data.eventType,
      resourceId: data.resourceId,
      resourceTitle: data.resourceTitle,
      resourceType: data.resourceType,
      pagePath: data.pagePath,
      pageTitle: data.pageTitle,
      sessionId: data.sessionId,
      ipHash: hashIP(ip),
      userAgent: userAgent,
      referrer: data.referrer || '',
      country: data.country || 'Unknown',
      device: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      duration: data.duration || 0,
      scrollDepth: data.scrollDepth || 0,
      timestamp: new Date()
    });

    await event.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
