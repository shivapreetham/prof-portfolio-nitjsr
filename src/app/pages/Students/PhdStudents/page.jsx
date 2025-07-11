"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, GraduationCap, Calendar, User, BookOpen } from "lucide-react"
import Link from "next/link"

const PhdStudents = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("https://www.nitjsr.ac.in/backend/api/thesissupervised/phd?id=CS103")
        const result = await res.json()
        setData(result.sort((a, b) => b.completion_year - a.completion_year))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching PhD data:", err)
        setLoading(false)
      }
    }
    getData()
  }, [])

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
          <Link href="/pages/Students" className="hover:text-[#0284C7] transition-colors">
            Students
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">PhD Students</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">PhD Students</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full mb-4"></div>
          <p className="text-gray-600">Doctoral thesis supervision and guidance</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {data.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#0891B2] rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#064A6E]">{student.student_name}</h3>
                          <span className="px-3 py-1 bg-[#0284C7] text-white text-sm rounded-full font-medium">
                            PhD
                          </span>
                        </div>
                        {student.thesis_title && (
                          <div className="flex items-start space-x-2 mb-3">
                            <BookOpen className="w-4 h-4 text-[#0284C7] mt-1 flex-shrink-0" />
                            <p className="text-gray-700 font-medium">{student.thesis_title}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          {student.completion_year && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Completed: {student.completion_year}</span>
                            </div>
                          )}
                          {student.status && (
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Status: {student.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No PhD Students Found</h3>
                <p className="text-gray-500">PhD student information will appear here once available.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default PhdStudents
