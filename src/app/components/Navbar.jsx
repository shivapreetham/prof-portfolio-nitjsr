"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Research Area", path: "/pages/Research" },
    { name: "Teachings", path: "" },
    { name: "Research Publications", path: "/pages/Projects" },
    { name: "Responsibilities", path: "/pages/Collaborations" },
    { name: "Thesis Supervised", path: "" },
    { name: "Other Achievements", path: "/pages/Awards" },
    { name: "Contact", path: "" },
  ];

  return (
    <nav className="w-full flex justify-center py-4 bg-white z-10">
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-[1200px] rounded-xl overflow-hidden shadow-md bg-white">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Title on Mobile */}
          {isMobile && <span className="text-lg font-bold text-black">Menu</span>}
          {/* Toggle on Mobile */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-black">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
          {/* Links on Desktop */}
          {!isMobile && (
            <ul className="flex flex-wrap justify-center w-full gap-6 text-sm font-semibold text-black font-poppins">
              {navLinks.map((item, index) => (
                <li key={index} className="flex items-center space-x-1 hover:text-[#0284C7] transition-colors duration-200">
                  <Link
                    href={item.path}
                    className={`${pathname === item.path ? "text-[#0284C7]" : ""} transition-colors`}
                  >
                    {item.name}
                  </Link>
                  <FaChevronDown className="w-3 h-3 text-gray-600" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F4B400] overflow-hidden px-6 pb-4"
            >
              <div className="space-y-3">
                {navLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`block font-poppins text-black text-sm font-medium ${
                      pathname === item.path ? "text-white" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
