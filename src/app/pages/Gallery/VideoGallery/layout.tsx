import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Gallery - Professor Portfolio',
  description: 'Watch educational videos, lectures, talks, and presentations. Explore multimedia content covering various aspects of computer science and research.',
  keywords: ['videos', 'lectures', 'talks', 'presentations', 'education', 'computer science', 'multimedia'],
  openGraph: {
    title: 'Video Gallery - Professor Portfolio',
    description: 'Watch educational videos, lectures, talks, and presentations covering computer science and research.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Gallery - Professor Portfolio',
    description: 'Watch educational videos, lectures, talks, and presentations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VideoGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}