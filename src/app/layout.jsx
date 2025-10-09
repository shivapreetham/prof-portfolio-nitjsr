import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import RouteTracker from "../components/analytics/RouteTracker";
import AuthProvider from "../components/AuthProvider";
import { Poppins } from "next/font/google";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-poppins",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Professor Portfolio - KK Sir",
    template: "%s | Professor Portfolio"
  },
  description: "Official portfolio of Professor at NIT Jamshedpur. Explore research publications, teaching experience, student supervision, and academic contributions in computer science.",
  keywords: [
    "professor", "NIT Jamshedpur", "computer science", "research", "publications", 
    "teaching", "PhD supervision", "academic", "faculty", "computer centre"
  ],
  authors: [{ name: "Professor Portfolio" }],
  creator: "Professor Portfolio",
  publisher: "NIT Jamshedpur",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    title: 'Professor Portfolio - KK Sir',
    description: 'Official portfolio of Professor at NIT Jamshedpur. Explore research publications, teaching experience, and academic contributions.',
    siteName: 'Professor Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professor Portfolio - KK Sir',
    description: 'Official portfolio of Professor at NIT Jamshedpur. Explore research publications and academic contributions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`} data-theme="dark">
        <AuthProvider>
          <Provider>
            <RouteTracker />
            <main>{children}</main>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
