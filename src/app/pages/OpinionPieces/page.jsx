"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Calendar, Eye, ChevronRight } from "lucide-react"
import Link from "next/link"

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const OpinionPiecesPage = () => {
  const [opinionPieces, setOpinionPieces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOpinions, setFilteredOpinions] = useState([])
  const [expandedOpinion, setExpandedOpinion] = useState(null)
  const [fullImageView, setFullImageView] = useState(null)

  useEffect(() => {
    const fetchOpinionPieces = async () => {
      try {
        const response = await fetch('/api/opinion-pieces')
        if (!response.ok) throw new Error('Failed to fetch opinion pieces')
        const data = await response.json()
        setOpinionPieces(data)
        setFilteredOpinions(data)
      } catch (error) {
        console.error('Error fetching opinion pieces:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpinionPieces()
  }, [])

  useEffect(() => {
    if (opinionPieces) {
      const lowerSearch = searchTerm.toLowerCase()
      const filtered = opinionPieces.filter(
        (opinion) => opinion.title.toLowerCase().includes(lowerSearch) || opinion.content.toLowerCase().includes(lowerSearch),
      )
      setFilteredOpinions(filtered)
    }
  }, [opinionPieces, searchTerm])

  if (isLoading) {
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
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-6xl">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[#0284C7] font-medium">Opinion Pieces</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Opinion Pieces</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 bg-[#0284C7] rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4">Thoughts, perspectives, and commentary from the professor.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0284C7] w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search opinion pieces..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white"
            />
          </div>
        </motion.div>

        <div className="mb-6 sm:mb-8">
          {filteredOpinions && filteredOpinions.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {filteredOpinions.map((opinion, index) => (
                <motion.div
                  key={opinion._id || index}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  initial="hidden"
                  animate="visible"
                  variants={cardAnimation}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {opinion.imageUrl && (
                      <div className="md:w-1/3 relative overflow-hidden">
                        <img
                          src={opinion.imageUrl || "/placeholder.svg"}
                          alt={opinion.title}
                          className="w-full h-40 sm:h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                      </div>
                    )}
                    <div className={`${opinion.imageUrl ? 'md:w-2/3' : 'w-full'} p-4 sm:p-6 md:p-8`}>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{new Date(opinion.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        {opinion.mediaFiles && opinion.mediaFiles.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs sm:text-sm">{opinion.mediaFiles.length} media attachment{opinion.mediaFiles.length !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#064A6E] mb-3 sm:mb-4 group-hover:text-[#0284C7] transition-colors">
                        {opinion.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">{opinion.content}</p>
                      <button
                        className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#0284C7] to-[#0891B2] text-white rounded-lg hover:from-[#064A6E] hover:to-[#0284C7] transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation"
                        onClick={() => setExpandedOpinion(opinion)}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Read Full Article</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💭</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2 px-4">
                {searchTerm ? `No opinion pieces found for "${searchTerm}"` : "No Opinion Pieces Found"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 px-4">
                {searchTerm ? "Try adjusting your search terms." : "Opinion pieces will appear here once published."}
              </p>
            </div>
          )}
        </div>
      </main>

      {expandedOpinion && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setExpandedOpinion(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white max-w-4xl w-full rounded-lg sm:rounded-xl p-4 sm:p-6 relative overflow-y-auto max-h-[85vh] sm:max-h-[80vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-black p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors z-10 touch-manipulation"
              onClick={() => setExpandedOpinion(null)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="pr-8 sm:pr-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#064A6E] mb-3 sm:mb-4">{expandedOpinion.title}</h2>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date(expandedOpinion.createdAt).toLocaleDateString()}</span>
              </div>
              {expandedOpinion.imageUrl && (
                <img
                  src={expandedOpinion.imageUrl || "/placeholder.svg"}
                  alt={expandedOpinion.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4 sm:mb-6 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFullImageView(expandedOpinion.imageUrl)
                  }}
                />
              )}
              <div className="prose max-w-none">
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{expandedOpinion.content}</p>
              </div>

              {expandedOpinion.mediaFiles && expandedOpinion.mediaFiles.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#064A6E] mb-3 sm:mb-4">Media Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {expandedOpinion.mediaFiles.map((file, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.filename || `Media ${index + 1}`}
                            className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFullImageView(file.url)
                            }}
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

      {/* Full Image Viewer Modal */}
      {fullImageView && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setFullImageView(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10 touch-manipulation"
              onClick={() => setFullImageView(null)}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <img
              src={fullImageView}
              alt="Full size view"
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OpinionPiecesPage
