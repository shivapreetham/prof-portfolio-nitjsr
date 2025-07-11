"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, ExternalLink, BookOpen, Calendar } from "lucide-react"

const Teachings = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("https://www.nitjsr.ac.in/backend/api/faculty_course?id=CS103")
        const result = await response.json()
        setData(result.result || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    getData()
  }, [])

 

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
          <span className="text-[#0284C7] font-medium">Teaching</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Courses Taught</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {data.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BookOpen className="w-5 h-5 text-[#0284C7]" />
                          <h3 className="text-lg font-semibold text-[#064A6E] group-hover:text-[#0284C7] transition-colors">
                            {course.course_name}
                          </h3>
                          <span className="px-3 py-1 bg-[#0891B2] text-white text-sm rounded-full font-medium">
                            {course.course_id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Semester: {course.year}</span>
                          </div>
                        </div>
                      </div>
                      {course.course_handout && (
                        <a
                          href={course.course_handout}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-[#064A6E] text-white rounded-lg hover:bg-[#0891B2] transition-colors group-hover:scale-105 transform duration-200"
                        >
                          <span className="text-sm font-medium">View Handout</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Found</h3>
                <p className="text-gray-500">Course information will appear here once available.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Teachings
