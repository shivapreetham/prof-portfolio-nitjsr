"use client";
import React from "react";

export default function Header({ user }) {
  return (
    <header className="bg-gradient-to-r from-[#064A6E] to-[#0891B2] text-white px-6 py-6 shadow-md">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {user.name}
        </h1>
        <div className="space-y-1.5">
          <p className="text-base sm:text-lg font-medium">
            Assistant Professor at NIT Jamshedpur
          </p>
          <p className="text-sm sm:text-base text-white/90">
            Faculty In Charge, Computer Centre
          </p>
          <p className="text-sm text-white/80">
            Prof. In Charge, NIMCET 2024
          </p>
        </div>
      </div>
    </header>
  );
}
