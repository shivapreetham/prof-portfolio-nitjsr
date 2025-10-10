import React from 'react';

export const metadata = {
  title: 'Research Publications - Professor Portfolio',
  description: 'Explore research publications including international journal papers, conference proceedings, books, and book chapters. Stay updated with the latest academic contributions.',
  keywords: ['research', 'publications', 'journal papers', 'conference papers', 'academic research', 'computer science'],
  openGraph: {
    title: 'Research Publications - Professor Portfolio',
    description: 'Explore research publications including international journal papers, conference proceedings, books, and book chapters.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Publications - Professor Portfolio',
    description: 'Explore research publications including international journal papers and conference proceedings.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResearchPublicationsLayout({ children }) {
  return <>{children}</>;
}