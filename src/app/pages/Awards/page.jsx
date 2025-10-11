"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/awards", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAwards(data);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching awards:", err);
        setError("Unable to load awards at the moment.");
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[#0284C7] font-medium">
            Awards & Activities
          </span>
        </nav>

        {/* Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textAnimation}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
            Awards & Academic Activities
          </h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6 md:p-8 text-center text-red-600 text-sm sm:text-base">
            {error}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Display awards from /api/awards first */}
            {awards.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {awards.map((award, index) => (
                  <motion.div
                    key={award._id || `${award.title}-${award.date}`}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemAnimation}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-5 md:p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-[#064A6E]">
                          {award.title}
                        </h2>
                        {award.organization && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {award.organization}
                          </p>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-[#0284C7] font-medium whitespace-nowrap">
                        {award.date
                          ? new Date(award.date).toLocaleDateString()
                          : "Date unavailable"}
                      </div>
                    </div>

                    {award.description && (
                      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {award.description}
                      </p>
                    )}

                    {Array.isArray(award.links) && award.links.length > 0 && (
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        {award.links.map((link, linkIndex) => (
                          <a
                            key={`${award._id}-link-${linkIndex}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] border border-[#0284C7]/40 px-3 py-1.5 rounded-full hover:bg-[#0284C7] hover:text-white transition-colors touch-manipulation"
                          >
                            External Link {linkIndex + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Show message if no awards */}
            {awards.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
                No awards recorded yet.
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        :global(.rich-content) {
          color: #1f2937;
        }
        :global(.rich-content h1),
        :global(.rich-content h2),
        :global(.rich-content h3) {
          color: #111827;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        :global(.rich-content ul),
        :global(.rich-content ol) {
          margin-left: 1.25rem;
          padding-left: 1rem;
        }
        :global(.rich-content li) {
          margin-bottom: 0.5rem;
        }
        :global(.rich-content p) {
          margin-bottom: 1rem;
        }
        :global(.rich-content strong) {
          color: #000;
          font-weight: bold;
        }
        :global(.rich-content a) {
          color: #0284c7;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
