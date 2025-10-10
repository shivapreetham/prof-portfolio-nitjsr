"use client";
// This component is deprecated - RouteTracker.jsx now handles all analytics
// Keeping this file to prevent import errors, but it no longer does any tracking

export default function AnalyticsProvider({ children }) {
  // No longer doing any analytics tracking - RouteTracker handles it
  return <>{children}</>;
}
