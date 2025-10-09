import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Professor Portfolio',
  description: 'Administrative dashboard for managing portfolio content, analytics, and website settings. Access restricted to authorized users.',
  keywords: ['admin', 'dashboard', 'management', 'analytics', 'administration'],
  openGraph: {
    title: 'Admin Dashboard - Professor Portfolio',
    description: 'Administrative dashboard for managing portfolio content and analytics.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}