"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Briefcase } from "lucide-react"
import Link from "next/link"

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const ResponsibilitiesPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [responsibility, setResponsibility] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const resData = await fetch(`https://nitjsr.ac.in/backend/api/people/responsibility?id=CS103`)
        const result = await resData.json()
        setResponsibility(result || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching responsibilities:", error)
        setIsLoading(false)
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
          <span className="text-[#0284C7] font-medium">Responsibilities</span>
        </nav>

        {/* Page Title */}
        <motion.div initial="hidden" animate="visible" variants={textAnimation} className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Responsibilities</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 lg:w-28 bg-[#0284C7] rounded-full mb-4"></div>
          <p className="text-gray-600">Administrative and academic responsibilities</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {responsibility && responsibility.length > 0 ? (
              <div className="p-8">
                {responsibility.map((res, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={textAnimation}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6 last:mb-0"
                  >
                    <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-[#0891B2] rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div
                          className="max-w-none responsibility-content"
                          dangerouslySetInnerHTML={{ __html: res.ds }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Responsibilities Found</h3>
                <p className="text-gray-500">Responsibility information will appear here once available.</p>
              </div>
            )}
          </div>
        )}
      </main>
<style jsx>{`
  :global(.responsibility-content h1),
  :global(.responsibility-content h2),
  :global(.responsibility-content h3) {
    color: #111827;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  :global(.responsibility-content p) {
    color: #1f2937;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  :global(.responsibility-content ul),
  :global(.responsibility-content ol) {
    color: #1f2937;
    padding-left: 1.5rem;
  }

  :global(.responsibility-content li) {
    margin-bottom: 0.5rem;
  }

  :global(.responsibility-content strong) {
    color: #111827;
    font-weight: 600;
  }

  :global(.responsibility-content a) {
    color: #1f2937;
    text-decoration: none;
  }
`}</style>


    </div>
  )
}

export default ResponsibilitiesPage
