import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Students - Professor Portfolio',
  description: 'Meet current and former students including PhD, Masters, and Bachelor students. Learn about their research work and academic achievements.',
  keywords: ['students', 'PhD', 'masters', 'bachelor', 'research students', 'supervision', 'mentorship'],
  openGraph: {
    title: 'Students - Professor Portfolio',
    description: 'Meet current and former students including PhD, Masters, and Bachelor students.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Students - Professor Portfolio',
    description: 'Meet current and former students and learn about their research work.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}