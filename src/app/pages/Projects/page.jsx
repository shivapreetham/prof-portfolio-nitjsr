"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../Provider"; // make sure this path is correct

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectsPage = () => {
  const { userData } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProject, setExpandedProject] = useState(null);

  const projects = userData.projects || [];

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (project) => {
    setExpandedProject(project);
  };

  const closeModal = () => setExpandedProject(null);

  return (
    <div className="bg-[#f5ffff] text-[#0093cb] min-h-screen">
      {/* Header */}
      <div className="h-[50vh] bg-[#0093cb] flex flex-col justify-center items-start text-[#f5ffff] px-6 lg:px-20">
        <motion.h1
          className="text-3xl lg:text-5xl font-bold mb-2"
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h1>
        <motion.p
          className="text-base lg:text-xl text-[#b3e6f9]"
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore all research & development projects
        </motion.p>
      </div>

      {/* Search */}
      <div className="px-4 lg:px-16 py-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-[#0093cb] rounded-lg bg-[#f5ffff] text-[#0093cb] placeholder-[#b3e6f9] focus:outline-none"
        />

        {/* Project Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
              onClick={() => handleProjectClick(project)}
            >
              <img
                src={project.banner || "/images/default.jpg"}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#0093cb]">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {expandedProject && (
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                onClick={closeModal}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#0093cb]">
                {expandedProject.title}
              </h2>
              <img
                src={expandedProject.banner || "/images/default.jpg"}
                alt={expandedProject.title}
                className="w-full rounded-md mb-4"
              />
              <p className="text-gray-600">{expandedProject.description}</p>
              {expandedProject.collaborators && (
                <p className="text-sm text-gray-500 mt-4">
                  Collaborators: {expandedProject.collaborators}
                </p>
              )}
              {expandedProject.videoUrl && (
                <a
                  href={expandedProject.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-4 block"
                >
                  Watch Video
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
