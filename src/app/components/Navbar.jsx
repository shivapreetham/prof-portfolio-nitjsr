"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth <= 1300);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    handleResize(); 
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isNotHome = pathname !== "/";

  const navLinks = [
    { name: "Experience", path: "/pages/Experience" },
    { name: "Projects", path: "/pages/Projects" },
    { name: "Research Papers", path: "/pages/Research" },
    { name: "Conferences", path: "/pages/Conferences" },
    { name: "Achievements / Awards", path: "/pages/Awards" },
    { name: "Blog Posts", path: "/pages/Blogs" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 shadow-md ${
        scrolled || isNotHome ? "text-white bg-[#0093cb]" : "text-[#0093cb] bg-white"
      }`}
    >
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">
         Koushlendra Kumar Singh
      </Link>
        {!isMobile && (
          <ul className="flex space-x-6 ml-[200px] text-sm">  {/* Reduced ml spacing & text size */}
          {navLinks.map((item, index) => (
            <li key={index} className="relative group">
              <Link href={item.path} className="relative px-2 transition duration-200">
                {item.name}
                <span
                  className="absolute left-0 bottom-[-4px] w-0 h-[2px] transition-all duration-300 ease-in-out group-hover:w-full"
                  style={{
                    backgroundColor: scrolled || isNotHome ? "#f5ffff" : "#0093cb",
                  }}
                ></span>
              </Link>
            </li>
          ))}
        </ul>
        )}
        {isMobile && (
          <button className="text-2xl focus:outline-none"> {/* Reduced icon size */}
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        )}
      </div>
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen bg-[#0093cb] text-white flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-5 right-6 text-3xl"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            <ul className="flex flex-col items-center space-y-6 text-xl">
              {navLinks.map((item, index) => (
                <li key={index} className="relative group">
                  <Link
                    href={item.path}
                    className="relative transition duration-200 inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                    <span className="block w-0 h-[2px] bg-white transition-all duration-300 mx-auto group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
