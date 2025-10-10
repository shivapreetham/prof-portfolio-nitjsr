"use client";
import React from "react";

export default function Header({ user }) {
  const nameFont = user.nameFont || 'Merriweather';

  return (
    <header className="bg-gradient-to-r from-[#064A6E] to-[#0891B2] text-white px-6 py-6 shadow-md transition-colors">
      <div className="max-w-screen-xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{
            fontFamily: `${nameFont}, serif`
          }}
        >
          {user.name}
        </h1>
        <div className="space-y-1.5">
          <p className="text-base sm:text-lg font-medium">
            {user.designation1 || "Your Designation Here"}
          </p>
          <p className="text-sm sm:text-base text-white/90">
            {user.designation2 || "Your Designation Here"}
          </p>
          <p className="text-sm text-white/80">
            {user.designation3 || "Your Designation Here"}
          </p>
        </div>
      </div>
    </header>
  );
}
