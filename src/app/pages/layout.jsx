"use client"
import React from 'react';
import Navbar from '../components/Navbar';


export default function PagesLayout({ children }) {
    return (
        <div>

                <Navbar/>
            
            <div className="">
              
                {children}
              
            </div>
        </div>
    );
}