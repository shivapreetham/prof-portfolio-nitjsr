"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X, ExternalLink, Users, ChevronRight } from "lucide-react"
import { useUser } from "../../Provider"
import Link from "next/link"

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const ProjectsPage = () => {
  const { userData } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedProject, setExpandedProject] = useState(null)

  const projects = userData?.projects || []
  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleProjectClick = (project) => {
    setExpandedProject(project)
  }

  const closeModal = () => setExpandedProject(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Projects</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Projects</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full mb-4"></div>
          <p className="text-gray-600">Explore all research & development projects</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0284C7] w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white"
            />
          </div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial="hidden"
                animate="visible"
                variants={textAnimation}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.banner || "/placeholder.svg?height=200&width=400"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#064A6E] mb-3 group-hover:text-[#0284C7] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {project.collaborators && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Collaborators</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-[#0284C7] font-medium">
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? `No projects found for "${searchQuery}"` : "No Projects Found"}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? "Try adjusting your search terms." : "Projects will appear here once added."}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {expandedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={closeModal}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="pr-12">
                <h2 className="text-3xl font-bold mb-4 text-[#064A6E]">{expandedProject.title}</h2>
                <img
                  src={expandedProject.banner || "/placeholder.svg?height=300&width=600"}
                  alt={expandedProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">{expandedProject.description}</p>
                </div>
                {expandedProject.collaborators && (
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-[#0284C7]" />
                    <span className="font-medium text-gray-700">Collaborators:</span>
                    <span className="text-gray-600">{expandedProject.collaborators}</span>
                  </div>
                )}
                {expandedProject.videoUrl && (
                  <a
                    href={expandedProject.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Watch Video</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjectsPage
