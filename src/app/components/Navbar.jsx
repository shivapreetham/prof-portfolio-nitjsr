"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Research",
      path: "/pages/ResearchArea",
      dropdownItems: [
        { name: "Research Interests", path: "/pages/ResearchArea" },
        { name: "Publications", path: "/pages/ResearchPublications" },

      ],
    },
    // {
    //   name: "Projects",
    //   path: "/pages/Projects",
    //   dropdownItems: [
    //     { name: "Current Projects", path: "/pages/Projects" },
    //     { name: "Completed Projects", path: "/" },
    //     { name: "Collaborations", path: "/" },
    //   ],
    // },
    {
      name: "Students",
      path: "/pages/Students/PhdStudents",
      dropdownItems: [
        { name: "PhD Students", path: "/pages/Students/PhdStudents" },
        { name: "Masters Students", path: "/pages/Students/MastersStudents" },
        { name: "Bachelor Students", path: "/pages/Students/BachelorStudents" },
      ],
    },
    {
      name: "Responsibilities",
      path: "/pages/Responsibilities",
      dropdownItems: [
        { name: "Administrative", path: "/pages/Responsibilities" },
        { name: "Teachings", path: "/pages/Teachings" },
      ],
    },
    {
      name: "Achievements",
      path: "/pages/Awards",
      dropdownItems: [
        { name: "Conferences", path: "/pages/Conferences" },
        { name: "Awards & Honors", path: "/pages/Awards" },
        { name: "Funded Projects", path: "/pages/FundedProjects" },
      ],
    },
    {
      name: "Blog Posts",
      path: "/pages/Blogs",
      dropdownItems: [
        { name: "Recent Posts", path: "/pages/Blogs" },
        { name: "Opinion Pieces", path: "/pages/OpinionPieces" },
      ],
    },
    {
      name: "Gallery",
      path: "/pages/Gallery/PhotoGallery",
      dropdownItems: [
        { name: "Photo Gallery", path: "/pages/Gallery/PhotoGallery" },
        { name: "Video Gallery", path: "/pages/Gallery/VideoGallery" },
      ],
    },
    {
      name: "Contact",
      path: "/pages/Contact",
      dropdownItems: [
        { name: "Contact", path: "/pages/Contact" },
        { name: "Schedule Meeting", path: "/pages/Contact#schedule-meeting" },
      ],
    },
  ]

  return (
    <nav className="w-full flex justify-center py-4 bg-sky-50 z-10">
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-[1200px] rounded-xl overflow-visible shadow-md bg-sky-50">
        <div className="flex justify-between items-center px-6 py-4">
          {isMobile && <span className="text-lg font-bold text-black">Menu</span>}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-black">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          {/* Desktop Menu */}
          {!isMobile && (
            <ul className="flex flex-wrap justify-center w-full gap-6 text-sm font-semibold text-black font-poppins">
              {navLinks.map((item, index) => (
                <li key={index} className="relative group">
                  <div className="flex items-center space-x-1 group cursor-pointer transition-colors duration-200">
                    <Link
                      href={item.path}
                      className={`text-base transition-colors duration-200 ${
                        pathname === item.path ? "text-[#0284C7]" : "group-hover:text-[#0284C7]"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {item.dropdownItems && (
                      <FaChevronDown className="w-4 h-4 mt-[3px] text-gray-600 group-hover:text-[#0284C7] transition-colors duration-200" />
                    )}
                  </div>

                  {/* Desktop Dropdown - Centered and Fixed Width */}
                  {item.dropdownItems && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#0891B2] shadow-xl z-50 rounded-lg p-6 w-[500px] text-sm text-black font-normal">
                      <div className="flex">
                        <div className="w-1/2 pr-6 border-r border-gray-300">
                          <p className="text-lg font-semibold mb-2 text-white">
                            Explore {item.name} section for detailed information
                          </p>
                          <Link href={item.dropdownItems[0]?.path || item.path}>
                            <button className="mt-4 px-4 py-2 bg-[#064A6E] text-white rounded-md hover:bg-[#334155] transition-colors">
                              {item.name === "Research" ? "List of Publications" : `View ${item.name}`}
                            </button>
                          </Link>
                        </div>
                        <div className="w-1/2 pl-6">
                          <div className="flex flex-col space-y-2">
                            {item.dropdownItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.path}
                                className="text-base hover:text-white transition-colors text-[#022B35]"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0891B2] overflow-hidden px-6 pb-4"
            >
              <div className="space-y-3">
                {navLinks.map((item, index) => (
                  <div key={index}>
                    <div
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex justify-between items-center cursor-pointer text-black text-base font-semibold py-2"
                    >
                      <Link href={item.path} onClick={() => setMenuOpen(false)}>
                        <span>{item.name}</span>
                      </Link>
                      {item.dropdownItems && (
                        <FaChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Mobile Dropdown Items */}
                    {item.dropdownItems && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2 text-sm"
                      >
                        <p className="text-[13px] mt-2 text-white">
                          Explore {item.name} section for detailed information
                        </p>
                        <Link href={item.dropdownItems[0]?.path || item.path}>
                          <button className="mt-2 px-3 py-1 bg-[#064A6E] text-white rounded-md text-xs hover:bg-[#334155] transition-colors">
                            {item.name === "Research" ? "List of Publications" : `View ${item.name}`}
                          </button>
                        </Link>
                        {item.dropdownItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.path}
                            className="block text-[#022B35] hover:text-white transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}