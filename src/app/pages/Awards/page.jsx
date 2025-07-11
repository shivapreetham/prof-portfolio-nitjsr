"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function AwardsPage() {
  const [activities, setActivities] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const activitiesData = await fetch(`https://www.nitjsr.ac.in/backend/faculty/get_other_activities/CS103`)
        const res = await activitiesData.json()
        setActivities(res.result)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
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
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-sm leading-relaxed">
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: activities[0]?.activities || "<p>No content available.</p>" }}
            />
          </div>
        )}
      </main>

      <style jsx>{`
        :global(.rich-content) {
          color: #1f2937;
        }
        :global(.rich-content h1),
        :global(.rich-content h2),
        :global(.rich-content h3) {
          color: #111827;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        :global(.rich-content ul),
        :global(.rich-content ol) {
          margin-left: 1.25rem;
          padding-left: 1rem;
        }
        :global(.rich-content li) {
          margin-bottom: 0.5rem;
        }
        :global(.rich-content p) {
          margin-bottom: 1rem;
        }
        :global(.rich-content strong) {
          color: #000;
          font-weight: bold;
        }
        :global(.rich-content a) {
          color: #0284C7;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
