"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useUser } from "../Provider";     
import Footer from "../components/Footer";

export default function PagesLayout({ children }) {
  const { userData } = useUser();

  if (!userData?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={userData.user} />
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <div className="min-h-full">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
