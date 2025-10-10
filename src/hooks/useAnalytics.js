import { useCallback } from 'react';

let sessionId = null;

function getSessionId() {
  if (typeof window === 'undefined') return null;

  if (!sessionId) {
    const storedSession = sessionStorage.getItem('analytics_session_id');
    const sessionTimestamp = sessionStorage.getItem('analytics_session_timestamp');

    const SESSION_TIMEOUT = 30 * 60 * 1000;
    const now = Date.now();

    if (storedSession && sessionTimestamp) {
      const lastActivity = parseInt(sessionTimestamp);
      if (now - lastActivity < SESSION_TIMEOUT) {
        sessionId = storedSession;
        sessionStorage.setItem('analytics_session_timestamp', now.toString());
      } else {
        sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
        sessionStorage.setItem('analytics_session_timestamp', now.toString());
      }
    } else {
      sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
      sessionStorage.setItem('analytics_session_timestamp', now.toString());
    }
  } else {
    sessionStorage.setItem('analytics_session_timestamp', Date.now().toString());
  }

  return sessionId;
}

function getPageTitle(pathname) {
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathname === '/') {
    return 'Home - Professor Portfolio';
  }

  if (pathname.startsWith('/pages/')) {
    const pageName = pathSegments[pathSegments.length - 1];
    switch (pageName) {
      case 'Blogs':
        return 'Blog Posts - Professor Portfolio';
      case 'VideoGallery':
        return 'Video Gallery - Professor Portfolio';
      case 'PhotoGallery':
        return 'Photo Gallery - Professor Portfolio';
      case 'ResearchPublications':
        return 'Research Publications - Professor Portfolio';
      case 'ResearchArea':
        return 'Research Area - Professor Portfolio';
      case 'Awards':
        return 'Awards - Professor Portfolio';
      case 'Conferences':
        return 'Conferences - Professor Portfolio';
      case 'OpinionPieces':
        return 'Opinion Pieces - Professor Portfolio';
      case 'Teachings':
        return 'Teaching Experience - Professor Portfolio';
      case 'Students':
        return 'Students - Professor Portfolio';
      case 'PhdStudents':
        return 'PhD Students - Professor Portfolio';
      case 'MastersStudents':
        return 'Masters Students - Professor Portfolio';
      case 'BachelorStudents':
        return 'Bachelor Students - Professor Portfolio';
      case 'Contact':
        return 'Contact - Professor Portfolio';
      case 'Responsibilities':
        return 'Responsibilities - Professor Portfolio';
      case 'Projects':
        return 'Projects - Professor Portfolio';
      default:
        return `${pageName} - Professor Portfolio`;
    }
  }

  if (pathname.startsWith('/admin')) {
    if (pathname.includes('dashboard')) {
      return 'Analytics Dashboard - Admin';
    }
    return 'Admin Panel';
  }

  return 'Professor Portfolio';
}

export function useAnalytics() {
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
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
      pageTitle: getPageTitle(window.location.pathname),
      sessionId: getSessionId(),
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    }),
    keepalive: true
  }).catch(err => console.error('Opinion tracking error:', err));
}
