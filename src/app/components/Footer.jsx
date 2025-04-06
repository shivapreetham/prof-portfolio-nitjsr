// components/Footer.jsx
import React from "react";
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const navLinks = [
    { name: "Experience", path: "/Experience" },
    { name: "Projects", path: "/Projects" },
    { name: "Research Papers", path: "/Research" },
    { name: "Collaborations", path: "/Collaborations" },
    { name: "Achievements / Awards", path: "/Awards" },
    { name: "Blog Posts", path: "/Blogs" },
  ];

  return (
    <footer className="bg-[#0093cb] text-[#f5ffff] py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Get in Touch</h2>
          <p className="text-lg">
            <a href="mailto:research@professor.edu" className="hover:text-[#b3e6f9] underline">
              research@professor.edu
            </a>
          </p>
          <p className="text-lg">
            <a href="mailto:hello@professor.edu" className="hover:text-[#b3e6f9] underline">
              hello@professor.edu
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Connect</h2>
          <div className="flex space-x-6 text-2xl">
            <a href="https://linkedin.com/in/professor" target="_blank" rel="noopener noreferrer" className="hover:text-[#b3e6f9]">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/professor" target="_blank" rel="noopener noreferrer" className="hover:text-[#b3e6f9]">
              <FaTwitter />
            </a>
            <a href="https://github.com/professor" target="_blank" rel="noopener noreferrer" className="hover:text-[#b3e6f9]">
              <FaGithub />
            </a>
            <a href="mailto:contact@professor.edu" className="hover:text-[#b3e6f9]">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className="text-lg hover:text-[#b3e6f9] underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Office Address */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Office Address</h2>
          <p className="text-lg">Room 123, Computer Science Building</p>
          <p className="text-lg">University Name</p>
          <p className="text-lg">City, Country</p>
        </div>
      </div>

      <div className="mt-12 text-center border-t border-[#b3e6f9] pt-8">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} Professor Portfolio. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
