"use client"
import React from 'react';
import AdminSidePanel from './components/AdminSidePanel';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AdminLayout({ children }) {
    return (
        <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-gray-900 text-white">
                <Toaster position="bottom-right" />
                <AdminSidePanel />
                <div className="transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}