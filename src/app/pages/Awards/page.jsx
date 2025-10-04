"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const itemAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.4, ease: "easeOut" },
  }),
}

export default function AwardsPage() {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getData = async () => {
      try {
        // const activitiesData = await fetch(`https://www.nitjsr.ac.in/backend/faculty/get_other_activities/CS103`)
        // const res = await activitiesData.json()
        const res = await fetch('/api/awards', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch awards')
        const data = await res.json()
        setAwards(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching awards:', err)
        setError('Unable to load awards at the moment.')
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Awards & Activities</span>
        </nav>

        {/* Title */}
        <motion.div initial="hidden" animate="visible" variants={textAnimation} className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Awards & Academic Activities</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 text-center text-red-600">
            {error}
          </div>
        ) : awards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center text-gray-600">
            No awards recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {awards.map((award, index) => (
              <motion.div
                key={award._id || `${award.title}-${award.date}`}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemAnimation}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#064A6E]">{award.title}</h2>
                    {award.organization && (
                      <p className="text-sm text-gray-600 mt-1">{award.organization}</p>
                    )}
                  </div>
                  <div className="text-sm text-[#0284C7] font-medium">
                    {award.date ? new Date(award.date).toLocaleDateString() : 'Date unavailable'}
                  </div>
                </div>

                {award.description && (
                  <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {award.description}
                  </p>
                )}

                {Array.isArray(award.links) && award.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {award.links.map((link, linkIndex) => (
                      <a
                        key={`${award._id}-link-${linkIndex}`}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] border border-[#0284C7]/40 px-3 py-1 rounded-full hover:bg-[#0284C7] hover:text-white transition-colors"
                      >
                        External Link {linkIndex + 1}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
