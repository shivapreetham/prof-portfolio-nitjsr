"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import InternationalJournal from "./InternationalJournal"
import InternationalConference from "./InternationalConference"
import BookChapters from "./BookChapters"
import Books from "./Books"

const pubTypes = [
  {
    name: "International Journal Papers",
    component: InternationalJournal,
    key: "ijp",
    value: "International Journal Paper",
  },
  {
    name: "International Conference Papers",
    component: InternationalConference,
    key: "icp",
    value: "International Conference Paper",
  },
  {
    name: "Book Chapters",
    component: BookChapters,
    key: "bkc",
    value: "Book Chapters",
  },
  {
    name: "Books",
    component: Books,
    key: "bk",
    value: "Book",
  },
]

const ResearchPublications = () => {
  const [activeSubTab, setActiveSubTab] = useState(0)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [publications, setPublications] = useState([])
  const [publicationLoaded, setPublicationLoaded] = useState(false)

  const renderSubTabContent = (publications) => {
    const propData = publications.filter((pub) => pub?.type === pubTypes[activeSubTab].value)
    const ActiveComponent = pubTypes[activeSubTab].component
    return <ActiveComponent propData={propData} />
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const publicationsData = await fetch(`https://www.nitjsr.ac.in/backend/api/publications?id=CS103`)
        let a = await publicationsData.json()
        a = a.result || []
        a.sort((a, b) => b.pub_date - a.pub_date)
        setPublications(a)
        setPublicationLoaded(true)
      } catch (error) {
        console.error("Error fetching publications:", error)
        setPublicationLoaded(true)
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
          <Link href="/pages/ResearchArea" className="hover:text-[#0284C7] transition-colors">
            Research
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Publications</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Research Publications</h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {/* Tabs */}
          <div className="overflow-x-auto mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
              {pubTypes.map((subTab, index) => (
                <button
                  key={index}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 whitespace-nowrap ${
                    activeSubTab === index
                      ? "bg-[#0891B2] text-white shadow-md"
                      : "text-gray-600 hover:text-[#064A6E] hover:bg-white"
                  }`}
                  onClick={() => setActiveSubTab(index)}
                >
                  {subTab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="w-full">
            {publicationLoaded ? (
              <>
                {publications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Publications Found</h3>
                    <p className="text-gray-500">Publications will appear here once they are added.</p>
                  </div>
                ) : (
                  <motion.div
                    key={activeSubTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderSubTabContent(publications)}
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResearchPublications
