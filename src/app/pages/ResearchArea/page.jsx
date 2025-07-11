"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const ResearchArea = () => {
  const [research, setResearch] = useState([])
  const [member, setMember] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const getData = async () => {
      try {
        const memberData = await fetch(`https://nitjsr.ac.in/backend/api/members?id=CS103`)
        const memberRes = await memberData.json()
        setMember(memberRes.result || [])

        const researchData = await fetch(`https://nitjsr.ac.in/backend/api/research?id=CS103`)
        const researchRes = await researchData.json()
        setResearch(researchRes.result || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    getData()
  }, [])


  return (
    <div className="min-h-screen bg-white text-[#223843]">
      

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Research</span>
        </nav>

        {/* Page Title */}
        <motion.div initial="hidden" animate="visible" variants={textAnimation} className="mb-8">
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Research Areas</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Research Areas */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textAnimation}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-[#064A6E] mb-6 flex items-center">
                <div className="w-1 h-8 bg-[#0284C7] rounded-full mr-3"></div>
                Research Interests
              </h2>
              {research.length > 0 ? (
                <ul className="space-y-3">
                  {research.map((value, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-[#0284C7] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{value.topic}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No research areas found.</p>
              )}
            </motion.div>

            {/* Professional Societies */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textAnimation}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-2xl font-semibold text-[#064A6E] mb-6 flex items-center">
                <div className="w-1 h-8 bg-[#0284C7] rounded-full mr-3"></div>
                Professional Societies
              </h3>
              {member.length > 0 ? (
                <ul className="space-y-3">
                  {member.map((society, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-[#0284C7] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{society.member}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No society memberships found.</p>
              )}
            </motion.div>
          </div>
        )}
      </main>

    </div>
  )
}

export default ResearchArea
