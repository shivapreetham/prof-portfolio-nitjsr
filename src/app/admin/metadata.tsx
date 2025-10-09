import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Professor Portfolio',
  description: 'Administrative dashboard for managing portfolio content, analytics, and website settings. Access restricted to authorized users.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}