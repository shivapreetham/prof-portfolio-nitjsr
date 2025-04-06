import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} data-theme="dark">
        <Provider>
          {/* <Navbar /> */}
          <main>{children}</main> 
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}
