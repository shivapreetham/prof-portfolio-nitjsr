"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

const BachelorStudents = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch from both APIs in parallel
        const [externalRes, localRes] = await Promise.all([
          fetch("https://www.nitjsr.ac.in/backend/api/thesissupervised/btech?id=CS103", { cache: "no-store" }),
          fetch("/api/students?type=bachelor", { cache: "no-store" }),
        ])

        if (!externalRes.ok || !localRes.ok) {
          throw new Error("Failed to fetch data from one or more APIs")
        }

        // Parse both JSON responses
        const [externalData, localData] = await Promise.all([externalRes.json(), localRes.json()])

        // Combine both datasets
        const combinedData = [...externalData, ...localData]

        // Sort by completion year (descending)
        const sorted = combinedData.sort(
          (a, b) => Number(b.completion_year || 0) - Number(a.completion_year || 0)
        )

        setData(sorted)
      } catch (err) {
        console.error("Error fetching Bachelor data:", err)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

  const theses =
    data?.length > 0 ? data : [{ research_topic: "No Thesis Supervised", name_of_student: "N/A", completion_year: 0 }]

  const offset = currentPage * itemsPerPage
  const currentData = theses.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(theses.length / itemsPerPage)

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage)
  }

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
          <span className="text-[#0284C7] font-medium">Bachelor Students</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Bachelor Students</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 lg:w-28 bg-[#0284C7] rounded-full mb-4"></div>
          <p className="text-gray-600">BTech project supervision and guidance</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-[#064A6E]">Bachelors Theses Supervised</h3>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-[#0891B2] text-white">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Research Topic</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Student</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Year of Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((thesis, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                          {thesis.research_topic || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                          {thesis.name_of_student || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                          {thesis.completion_year || "Ongoing"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 border border-gray-300 rounded cursor-pointer transition-colors ${
                        currentPage === i ? "bg-[#0891B2] text-white" : "hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(pageCount - 1, currentPage + 1))}
                    disabled={currentPage === pageCount - 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BachelorStudents
