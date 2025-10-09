"use client"
import React from 'react';
import AdminSidePanel from './components/AdminSidePanel';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen">
            <Toaster position="bottom-right" />
            <AdminSidePanel />
            <div className="transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
                {children}
            </div>
        </div>
    );
}