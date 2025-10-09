'use client';
import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Award,
  BookOpen,
  Newspaper,
  MessageSquare,
  Calendar,
  Users,
  Image,
  Video,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

const AdminSidePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '4rem' : '16rem'
    );
  }, [isCollapsed]);

  const sections = [
    { id: 'basic-details', name: 'Personal Information', icon: User },
    { id: 'research-papers', name: 'Research Papers', icon: FileText },
    { id: 'conferences', name: 'Conferences', icon: BookOpen },
    { id: 'awards', name: 'Awards', icon: Award },
    { id: 'blogs', name: 'Blogs', icon: Newspaper },
    { id: 'opinions', name: 'Opinion Pieces', icon: MessageSquare },
    { id: 'meeting-requests', name: 'Meeting Requests', icon: Calendar },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'photos', name: 'Photos', icon: Image },
    { id: 'videos', name: 'Videos', icon: Video },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-base-200 shadow-lg transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-base-content">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-base-300 transition-colors text-base-content group"
              title={isCollapsed ? section.name : ''}
            >
              <section.icon
                size={20}
                className="flex-shrink-0 text-[#0891B2] group-hover:text-[#064A6E]"
              />
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">{section.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-base-300 p-2">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0891B2] text-white hover:bg-[#064A6E] transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Analytics Dashboard' : ''}
        >
          <BarChart3 size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Analytics</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidePanel;
