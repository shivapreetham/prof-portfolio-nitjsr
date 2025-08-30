"use client";
import React from "react";

export default function Header({ user }) {
  return (
    <header className="bg-[#0891B2] text-[#064A6E] px-6 py-4 text-left">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#022B35]">
          {user.name}
        </h1>
        <p className="text-sm sm:text-base mt-2 font-semibold">
          Assistant Professor at NIT Jamshedpur
        </p>
        <p className="text-xs sm:text-sm">
          Faculty In Charge, Computer Centre
        </p>
        <p className="text-xs italic">Prof. In Charge, NIMCET 2024</p>
      </div>
    </header>
  );
}
