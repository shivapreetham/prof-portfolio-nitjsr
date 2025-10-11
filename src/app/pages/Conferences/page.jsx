"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CalendarDays, MapPin, ExternalLink, Award, ChevronRight, FileText } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function ConferencesPage() {
  const [conferences, setConferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        // const response = await fetch("https://legacy-source.example/api/conferences")
        const response = await fetch("/api/conferences", { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to fetch conferences")
        const data = await response.json()
        setConferences(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching conferences:", err)
        setError("Unable to load conferences right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchConferences()
  }, [])

  const conferencesByYear = useMemo(() => {
    return conferences
      .map((conference) => ({
        ...conference,
        dateValue: conference.date ? new Date(conference.date) : null,
      }))
      .sort((a, b) => {
        if (a.dateValue && b.dateValue) return b.dateValue - a.dateValue
        if (a.dateValue) return -1
        if (b.dateValue) return 1
        return (b.createdAt || "").localeCompare(a.createdAt || "")
      })
      .reduce((acc, conference) => {
        const year = conference.dateValue?.getFullYear()?.toString() || "Undated"
        if (!acc[year]) acc[year] = []
        acc[year].push(conference)
        return acc
      }, {})
  }, [conferences])

  const years = Object.keys(conferencesByYear).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-6xl">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[#0284C7] font-medium">Conferences</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Conferences & Invited Talks</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 bg-[#0284C7] rounded-full" />
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-3xl">
            A curated list of conferences, workshops, and invited talks featuring the faculty member. Each entry includes location details, presentation status, and supporting resources where available.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6 md:p-8 text-center text-red-600 text-sm sm:text-base">
            {error}
          </div>
        ) : conferences.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
            No conference information recorded yet.
          </div>
        ) : (
          <motion.div
            className="space-y-8 sm:space-y-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {years.map((year) => (
              <section key={year} className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 md:w-12 h-[3px] bg-[#0284C7] rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#064A6E]">{year}</h2>
                </div>
                <div className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
                  {conferencesByYear[year].map((conference, confIndex) => (
                    <motion.article
                      key={conference._id ?? confIndex}
                      variants={itemVariants}
                      className="h-full bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4"
                    >
                      <header className="space-y-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0284C7] flex items-start gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#064A6E] flex-shrink-0 mt-0.5" />
                          <span>{conference.name || "Untitled Conference"}</span>
                        </h3>
                        {conference.location && (
                          <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                            <span>{conference.location}</span>
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                          <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
                          {conference.dateValue ? conference.dateValue.toLocaleDateString() : "Date not specified"}
                        </p>
                        {conference.paperPresented && (
                          <p className="inline-flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                            <FileText className="w-3 h-3" /> Paper Presented
                          </p>
                        )}
                      </header>

                      {conference.description && (
                        <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {conference.description}
                        </p>
                      )}

                      {Array.isArray(conference.links) && conference.links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {conference.links.map((link, linkIndex) => (
                            <a
                              key={conference._id ? `${conference._id}-link-${linkIndex}` : `${conference.name ?? "conference"}-link-${linkIndex}`}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] border border-[#0284C7]/40 px-3 py-1.5 rounded-full hover:bg-[#0284C7] hover:text-white transition-colors touch-manipulation"
                            >
                              <ExternalLink className="w-3 h-3" /> Resource {linkIndex + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}
