import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

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
        <Provider>
        <body data-theme="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
        </body>
        </Provider>
      </html>
  );
}
