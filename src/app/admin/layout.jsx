"use client"
import React from 'react';
import { SessionProvider } from "next-auth/react";
// import SideNav from './components/SideNav';
import { Toaster } from 'react-hot-toast';
export default function AdminLayout({ children }) {
    return (
        <div>
            <Toaster position="bottom-right" />
            <div className="w-24 fixed">
                {/* <SideNav/> */}
            </div>
            <div className="ml-24">
                <SessionProvider>
                {children}
                </SessionProvider>
            </div>
        </div>
    );
}