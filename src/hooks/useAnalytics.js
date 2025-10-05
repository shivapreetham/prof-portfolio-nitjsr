import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

let sessionId = null;

function getSessionId() {
  if (typeof window === 'undefined') return null;

  if (!sessionId) {
    sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
  }
  return sessionId;
}

export function useAnalytics() {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercentage > maxScrollRef.current) {
        maxScrollRef.current = Math.min(scrollPercentage, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!pathname) return;

    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;

    trackEvent({
      eventType: 'page_view',
      pagePath: pathname,
      pageTitle: document.title
    });

    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration > 0) {
        trackEvent({
          eventType: 'page_view',
          pagePath: pathname,
          pageTitle: document.title,
          duration,
          scrollDepth: maxScrollRef.current
        });
      }
    };
  }, [pathname]);

  const trackEvent = useCallback(async (eventData) => {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        ...eventData,
        sessionId: getSessionId(),
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      };

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  return { trackEvent };
}

export function trackBlogView(blogId, blogTitle) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'blog_view',
      resourceId: blogId,
      resourceTitle: blogTitle,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Blog tracking error:', err));
}

export function trackVideoPlay(videoId, videoTitle) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'video_play',
      resourceId: videoId,
      resourceTitle: videoTitle,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Video tracking error:', err));
}

export function trackPaperView(paperId, paperTitle) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'paper_view',
      resourceId: paperId,
      resourceTitle: paperTitle,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Paper tracking error:', err));
}

export function trackPhotoView(photoId, photoCaption) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'photo_view',
      resourceId: photoId,
      resourceTitle: photoCaption,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Photo tracking error:', err));
}

export function trackStudentView(studentId, studentName, studentType) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'student_view',
      resourceId: studentId,
      resourceTitle: studentName,
      resourceType: studentType,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Student tracking error:', err));
}

export function trackConferenceView(conferenceId, conferenceName) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'conference_view',
      resourceId: conferenceId,
      resourceTitle: conferenceName,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Conference tracking error:', err));
}

export function trackAwardView(awardId, awardTitle) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'award_view',
      resourceId: awardId,
      resourceTitle: awardTitle,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Award tracking error:', err));
}

export function trackOpinionView(opinionId, opinionTitle) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'opinion_view',
      resourceId: opinionId,
      resourceTitle: opinionTitle,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      referrer: document.referrer
    }),
    keepalive: true
  }).catch(err => console.error('Opinion tracking error:', err));
}
