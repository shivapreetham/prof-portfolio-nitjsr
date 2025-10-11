"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, DollarSign, Clock, Users, Briefcase } from "lucide-react";

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function FundedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/funded-projects", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProjects(data);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching funded projects:", err);
        setError("Unable to load funded projects at the moment.");
        setLoading(false);
      }
    };
    getData();
  }, []);

  const groupedProjects = projects.reduce((acc, project) => {
    const type = project.projectType || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(project);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[#0284C7] font-medium">
            Funded Projects
          </span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 flex items-center gap-2 sm:gap-3">
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0284C7]" />
            Funded Projects
          </h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 bg-[#0284C7] rounded-full mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Sponsored and international research projects
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {Object.keys(groupedProjects).length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
                No funded projects recorded yet.
              </div>
            ) : (
              Object.entries(groupedProjects).map(([type, typeProjects], typeIndex) => (
                <div key={type}>
                  <motion.h2
                    initial="hidden"
                    animate="visible"
                    variants={textAnimation}
                    className="text-lg sm:text-xl font-bold text-[#064A6E] mb-3 sm:mb-4 flex flex-wrap items-center gap-2"
                  >
                    {type} Projects
                    <span className="badge badge-primary text-xs sm:text-sm">{typeProjects.length}</span>
                  </motion.h2>

                  <div className="space-y-3 sm:space-y-4">
                    {typeProjects.map((project, index) => (
                      <motion.div
                        key={project._id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={itemAnimation}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300"
                      >
                        <div className="p-4 sm:p-5 md:p-6">
                          {/* Header */}
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                                {project.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#0284C7] font-medium">
                                {project.fundingAgency}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`badge text-xs sm:text-sm ${
                                project.status === 'Ongoing' ? 'badge-success' :
                                project.status === 'Completed' ? 'badge-info' :
                                'badge-warning'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>

                          {/* Project Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            {project.role && (
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-xs sm:text-sm text-gray-700">Role:</span>
                                <span className="text-xs sm:text-sm text-gray-600">{project.role}</span>
                              </div>
                            )}
                            {project.amount && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#0284C7]" />
                                <span className="text-xs sm:text-sm text-gray-600">{project.amount}</span>
                              </div>
                            )}
                            {project.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#0284C7]" />
                                <span className="text-xs sm:text-sm text-gray-600">{project.duration}</span>
                              </div>
                            )}
                            {project.collaborators && (
                              <div className="flex items-start gap-2 md:col-span-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#0284C7] mt-0.5" />
                                <span className="text-xs sm:text-sm text-gray-600">{project.collaborators}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {project.description && (
                            <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 whitespace-pre-wrap leading-relaxed">
                              {project.description}
                            </p>
                          )}

                          {/* Links */}
                          {Array.isArray(project.links) && project.links.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.links.map((link, linkIndex) => (
                                <a
                                  key={`${project._id}-link-${linkIndex}`}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] border border-[#0284C7]/40 px-3 py-1.5 rounded-full hover:bg-[#0284C7] hover:text-white transition-colors touch-manipulation"
                                >
                                  External Link {linkIndex + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
