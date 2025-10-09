import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Awards & Recognition - Professor Portfolio',
  description: 'View awards, honors, and recognition received for academic excellence, research contributions, and professional achievements.',
  keywords: ['awards', 'recognition', 'honors', 'achievements', 'academic excellence', 'research awards'],
  openGraph: {
    title: 'Awards & Recognition - Professor Portfolio',
    description: 'View awards, honors, and recognition received for academic excellence and research contributions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awards & Recognition - Professor Portfolio',
    description: 'View awards, honors, and recognition received for academic excellence.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}