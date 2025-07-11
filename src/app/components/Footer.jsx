"use client"
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa"
import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

const Footer = ({ user }) => {
  const email = user?.email || "contact@nitjsr.ac.in"
  const linkedin = user?.linkedIn || "https://linkedin.com/in/professor"
  const twitter = user?.twitter || "https://twitter.com/professor"
  const github = user?.github || "https://github.com/professor"

  const navLinks = [
    { name: "Research", path: "/pages/ResearchArea" },
    { name: "Projects", path: "/pages/Projects" },
    { name: "Students", path: "/pages/Students/PhdStudents" },
    { name: "Teachings", path: "/pages/Teachings" },
    { name: "Responsibilities", path: "/pages/Responsibilities" },
    { name: "Achievements", path: "/pages/Awards" },
    { name: "Blog Posts", path: "/pages/Blogs" },
    { name: "Contact", path: "/pages/Contact" },
  ]

  return (
    <footer className="bg-[#0891B2] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Contact Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#022B35] mb-4">Get in Touch</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#022B35]" />
              <a href={`mailto:${email}`} className="hover:text-[#022B35] transition-colors">
                {email}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#022B35]" />
              <span>(+91) XXX-XXXX-XXXX</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#022B35] mb-4">Connect</h2>
          <div className="flex space-x-4">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#064A6E] rounded-full flex items-center justify-center hover:bg-[#022B35] transition-colors"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#064A6E] rounded-full flex items-center justify-center hover:bg-[#022B35] transition-colors"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#064A6E] rounded-full flex items-center justify-center hover:bg-[#022B35] transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${email}`}
              className="w-10 h-10 bg-[#064A6E] rounded-full flex items-center justify-center hover:bg-[#022B35] transition-colors"
            >
              <FaEnvelope className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#022B35] mb-4">Quick Links</h2>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className="hover:text-[#022B35] transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-[#022B35] rounded-full"></span>
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Office Address */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#022B35] mb-4">Office Address</h2>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-[#022B35] mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p>Computer Science & Engineering Department</p>
              <p>National Institute of Technology Jamshedpur</p>
              <p>Adityapur, Jamshedpur - 831014</p>
              <p>Jharkhand, India</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center border-t border-[#064A6E] pt-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} KK singh Portfolio. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
