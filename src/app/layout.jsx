'use client';
import { Merriweather, Lora } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import RouteTracker from "../components/analytics/RouteTracker";
import AuthProvider from "../components/AuthProvider";
import { useUser } from "./Provider";
import { useEffect, useState, Suspense } from "react";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

function LayoutContent({ children }) {
  const { userData } = useUser();
  const [fontFamily, setFontFamily] = useState('Merriweather');

  useEffect(() => {
    if (userData?.user?.overallFont) {
      setFontFamily(userData.user.overallFont);
    }
  }, [userData]);

  return (
    <body className={`${merriweather.variable} font-serif antialiased`} style={{ fontFamily: fontFamily }}>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      <main>{children}</main>
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>Kaushalendra Kushal Kumar</title>
        <meta name="description" content="Official portfolio of Professor at NIT Jamshedpur. Explore research publications, teaching experience, student supervision, and academic contributions in computer science." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Lora:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:wght@400;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <AuthProvider>
        <Provider>
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </AuthProvider>
    </html>
  );
}
