import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teaching Experience - Professor Portfolio',
  description: 'Explore teaching experience, courses taught, academic responsibilities, and educational contributions at NIT Jamshedpur and other institutions.',
  keywords: ['teaching', 'courses', 'education', 'academic', 'NIT Jamshedpur', 'computer science courses'],
  openGraph: {
    title: 'Teaching Experience - Professor Portfolio',
    description: 'Explore teaching experience, courses taught, and educational contributions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teaching Experience - Professor Portfolio',
    description: 'Explore teaching experience and courses taught.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TeachingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}