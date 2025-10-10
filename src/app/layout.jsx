import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import AnalyticsProvider from "./components/AnalyticsProvider";
import { Poppins } from "next/font/google";
// import Loader from "./components/Loader";
import NextTopLoader from "nextjs-toploader";

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
  title: "KK sir",
  description: "hello",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`} data-theme="dark">
        <NextTopLoader
          color="#F3F4F6"       
          height={3}            
          showSpinner={true}   
        />
        <Provider>
          <AnalyticsProvider>
            <main>{children}</main>
          </AnalyticsProvider>
        </Provider>
      </body>
    </html>
  );
}

