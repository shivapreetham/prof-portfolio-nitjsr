// Simple, clean analytics tracking functions with debugging

let sessionId = null;

function getSessionId() {
  if (typeof window === 'undefined') return null;

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function trackBlogView(blogId, blogTitle) {
  if (typeof window === 'undefined') return;

  console.log('📝 TRACKING BLOG VIEW:', { blogId, blogTitle });

  const data = {
    eventType: 'blog_view',
    resourceId: blogId,
    resourceTitle: blogTitle,
    pagePath: window.location.pathname,
    pageTitle: `Blog Posts - Professor Portfolio`,
    sessionId: getSessionId(),
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  console.log('📝 BLOG DATA BEING SENT:', data);

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('✅ Blog tracking response status:', response.status);
    return response.json();
  }).then(result => {
    console.log('📊 Blog tracking result:', result);
  }).catch(err => {
    console.error('❌ Blog tracking error:', err);
  });
}

export function trackVideoPlay(videoId, videoTitle) {
  if (typeof window === 'undefined') return;

  console.log('🎥 TRACKING VIDEO PLAY:', { videoId, videoTitle });

  const data = {
    eventType: 'video_play',
    resourceId: videoId,
    resourceTitle: videoTitle,
    pagePath: window.location.pathname,
    pageTitle: `Video Gallery - Professor Portfolio`,
    sessionId: getSessionId(),
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  console.log('🎥 VIDEO DATA BEING SENT:', data);

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('✅ Video tracking response status:', response.status);
    return response.json();
  }).then(result => {
    console.log('📊 Video tracking result:', result);
  }).catch(err => {
    console.error('❌ Video tracking error:', err);
  });
}

export function trackPaperView(paperId, paperTitle) {
  if (typeof window === 'undefined') return;

  console.log('📄 TRACKING PAPER VIEW:', { paperId, paperTitle });

  const data = {
    eventType: 'paper_view',
    resourceId: paperId,
    resourceTitle: paperTitle,
    pagePath: window.location.pathname,
    pageTitle: `Research Publications - Professor Portfolio`,
    sessionId: getSessionId(),
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  console.log('📄 PAPER DATA BEING SENT:', data);

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('✅ Paper tracking response status:', response.status);
    return response.json();
  }).then(result => {
    console.log('📊 Paper tracking result:', result);
  }).catch(err => {
    console.error('❌ Paper tracking error:', err);
  });
}

export function trackStudentView(studentId, studentName, studentType) {
  if (typeof window === 'undefined') return;

  console.log('👥 TRACKING STUDENT VIEW:', { studentId, studentName, studentType });

  const data = {
    eventType: 'student_view',
    resourceId: studentId,
    resourceTitle: studentName,
    resourceType: studentType,
    pagePath: window.location.pathname,
    pageTitle: `Students - Professor Portfolio`,
    sessionId: getSessionId(),
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  };

  console.log('👥 STUDENT DATA BEING SENT:', data);

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('✅ Student tracking response status:', response.status);
    return response.json();
  }).then(result => {
    console.log('📊 Student tracking result:', result);
  }).catch(err => {
    console.error('❌ Student tracking error:', err);
  });
}

// Legacy useAnalytics hook - now only for interaction tracking
export function useAnalytics() {
  return { 
    trackEvent: () => console.log('useAnalytics.trackEvent called - use specific tracking functions instead') 
  };
}