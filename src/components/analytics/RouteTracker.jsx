"use client";
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

let sessionId = null;
let pageViewId = null;

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

function generatePageViewId() {
  return `pv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        return `${pageName.replace(/([A-Z])/g, ' $1').trim()} - Professor Portfolio`;
    }
  }
  
  if (pathname.startsWith('/admin')) {
    if (pathname.includes('dashboard')) {
      return 'Analytics Dashboard - Admin';
    }
    return 'Admin Panel';
  }
  
  if (pathname.startsWith('/login')) {
    return 'Login - Professor Portfolio';
  }
  
  return 'Professor Portfolio';
}

function detectDevice() {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

export default function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTimeRef = useRef(null);
  const maxScrollRef = useRef(0);
  const currentPageViewIdRef = useRef(null);
  const hasTrackedRef = useRef(false);

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

    hasTrackedRef.current = false;
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    currentPageViewIdRef.current = generatePageViewId();

    const pageTitle = getPageTitle(pathname);
    const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    const trackPageView = async () => {
      if (hasTrackedRef.current) return;
      hasTrackedRef.current = true;

      try {
        const sessionData = getSessionId();

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_view',
            pagePath: fullPath,
            pageTitle: pageTitle,
            sessionId: sessionData,
            pageViewId: currentPageViewIdRef.current,
            referrer: document.referrer,
            device: detectDevice(),
            timestamp: new Date().toISOString()
          }),
          keepalive: true
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();

    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration > 1 && currentPageViewIdRef.current) {
        const blob = new Blob([JSON.stringify({
          eventType: 'page_exit',
          pagePath: fullPath,
          pageTitle: pageTitle,
          sessionId: getSessionId(),
          pageViewId: currentPageViewIdRef.current,
          duration,
          scrollDepth: maxScrollRef.current,
          device: detectDevice(),
          timestamp: new Date().toISOString()
        })], { type: 'application/json' });

        navigator.sendBeacon('/api/analytics/track', blob);
      }
    };
  }, [pathname, searchParams]);

  return null;
}