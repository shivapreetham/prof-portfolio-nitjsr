"use client";
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsProvider({ children }) {
  useAnalytics();
  return <>{children}</>;
}
