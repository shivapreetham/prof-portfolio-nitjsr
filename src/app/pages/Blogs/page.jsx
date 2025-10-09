"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Calendar, Eye, ChevronRight } from "lucide-react"
import { useUser } from "../../Provider"
import Link from "next/link"
import { trackBlogView } from "@/hooks/useAnalytics"

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const BlogPage = () => {
  const { userData, isLoading } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [expandedPost, setExpandedPost] = useState(null)

  useEffect(() => {
    if (userData?.blogPosts) {
      const lowerSearch = searchTerm.toLowerCase()
      const filtered = userData.blogPosts.filter(
        (post) => post.title.toLowerCase().includes(lowerSearch) || post.content.toLowerCase().includes(lowerSearch),
      )
      setFilteredPosts(filtered)
    }
  }, [userData, searchTerm])

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0093cb] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Blog Posts</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Blog Posts</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
          <p className="text-gray-600 mt-4">Insights, research, and updates from the professor.</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0284C7] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white"
            />
          </div>
        </motion.div>

        {/* Blog List */}
        <div className="mb-8">
          {filteredPosts && filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id || index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  initial="hidden"
                  animate="visible"
                  variants={cardAnimation}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {post.imageUrl && (
                      <div className="md:w-1/3 relative overflow-hidden">
                        <img
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                      </div>
                    )}
                    <div className={`${post.imageUrl ? 'md:w-2/3' : 'w-full'} p-8`}>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        {post.mediaFiles && post.mediaFiles.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{post.mediaFiles.length} media attachment{post.mediaFiles.length !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#064A6E] mb-4 group-hover:text-[#0284C7] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">{post.content}</p>
                      <button
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0284C7] to-[#0891B2] text-white rounded-lg hover:from-[#064A6E] hover:to-[#0284C7] transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        onClick={() => {
                          setExpandedPost(post)
                          // Track blog view
                          trackBlogView(post._id, post.title)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Read Full Article</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? `No posts found for "${searchTerm}"` : "No Blog Posts Found"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms." : "Blog posts will appear here once published."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Expanded Post */}
      {expandedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedPost(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white max-w-4xl w-full rounded-xl p-6 relative overflow-y-auto max-h-[80vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedPost(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="pr-12">
              <h2 className="text-3xl font-bold text-[#064A6E] mb-4">{expandedPost.title}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <Calendar className="w-4 h-4" />
                <span>{new Date(expandedPost.createdAt).toLocaleDateString()}</span>
              </div>
              {expandedPost.imageUrl && (
                <img
                  src={expandedPost.imageUrl || "/placeholder.svg"}
                  alt={expandedPost.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{expandedPost.content}</p>
              </div>
              
              {/* Additional Media Files */}
              {expandedPost.mediaFiles && expandedPost.mediaFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-[#064A6E] mb-4">Media Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expandedPost.mediaFiles.map((file, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.filename || `Media ${index + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        ) : (
                          <video
                            src={file.url}
                            controls
                            className="w-full h-auto"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {file.filename && (
                          <div className="p-2 bg-gray-50">
                            <p className="text-sm text-gray-600 truncate">{file.filename}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BlogPage
