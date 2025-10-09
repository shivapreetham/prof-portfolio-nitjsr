import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Information - Professor Portfolio',
  description: 'Get in touch with the professor. Find contact information, office location, email address, and other ways to connect for academic collaboration or inquiries.',
  keywords: ['contact', 'email', 'office', 'collaboration', 'academic inquiry', 'NIT Jamshedpur'],
  openGraph: {
    title: 'Contact Information - Professor Portfolio',
    description: 'Get in touch with the professor for academic collaboration or inquiries.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Information - Professor Portfolio',
    description: 'Get in touch with the professor for academic collaboration.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}