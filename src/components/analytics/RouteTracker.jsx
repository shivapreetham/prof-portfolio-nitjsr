"use client";
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

let sessionId = null;

function getSessionId() {
  if (typeof window === 'undefined') return null;

  if (!sessionId) {
    const storedSession = sessionStorage.getItem('analytics_session_id');
    const sessionTimestamp = sessionStorage.getItem('analytics_session_timestamp');
    
    // Session timeout after 30 minutes of inactivity
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    const now = Date.now();
    
    if (storedSession && sessionTimestamp) {
      const lastActivity = parseInt(sessionTimestamp);
      if (now - lastActivity < SESSION_TIMEOUT) {
        // Session is still valid, update timestamp
        sessionId = storedSession;
        sessionStorage.setItem('analytics_session_timestamp', now.toString());
      } else {
        // Session expired, create new one
        sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
        sessionStorage.setItem('analytics_session_timestamp', now.toString());
      }
    } else {
      // No existing session, create new one
      sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
      sessionStorage.setItem('analytics_session_timestamp', now.toString());
    }
  } else {
    // Update timestamp for existing session
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
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const isTracking = useRef(false);

  // Track scroll depth
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

  // Track page views
  useEffect(() => {
    if (!pathname || isTracking.current) return;
    
    isTracking.current = true;
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;

    const pageTitle = getPageTitle(pathname);
    const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    // Track page view
    const trackPageView = async () => {
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

    // Track page exit
    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration > 0) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          eventType: 'page_view',
          pagePath: fullPath,
          pageTitle: pageTitle,
          sessionId: getSessionId(),
          referrer: document.referrer,
          duration,
          scrollDepth: maxScrollRef.current,
          device: detectDevice(),
          timestamp: new Date().toISOString()
        }));
      }
      isTracking.current = false;
    };
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}