import React from 'react';
import { Metadata } from 'next';

export const metadata= {
  title: 'Blog Posts - Professor Portfolio',
  description: 'Read insights, research updates, and academic thoughts from the professor. Explore the latest blog posts covering various topics in computer science and research.',
  keywords: ['blog', 'research', 'computer science', 'academic writing', 'insights', 'professor'],
  openGraph: {
    title: 'Blog Posts - Professor Portfolio',
    description: 'Read insights, research updates, and academic thoughts from the professor.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Posts - Professor Portfolio',
    description: 'Read insights, research updates, and academic thoughts from the professor.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({ children }) {
  return children;
}