"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useUser } from "../../Provider";

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BlogPage = () => {
  const { userData, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    if (userData?.blogPosts) {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = userData.blogPosts.filter((post) =>
        post.title.toLowerCase().includes(lowerSearch) ||
        post.content.toLowerCase().includes(lowerSearch)
      );
      setFilteredPosts(filtered);
    }
  }, [userData, searchTerm]);

  if (isLoading || !userData) return <p className="p-8">Loading...</p>;

  return (
    <div className="bg-[#f5ffff] text-[#0093cb] min-h-screen">
      {/* Header */}
      <div className="h-[50vh] bg-[#0093cb] flex flex-col justify-center items-start text-[#f5ffff] px-6 lg:px-20 text-left">
        <h1 className="text-4xl lg:text-5xl font-bold mb-2">Blog</h1>
        <p className="text-lg lg:text-xl text-[#b3e6f9]">
          Insights, research, and updates from the professor.
        </p>
      </div>

      {/* Search */}
      <div className="px-6 lg:px-20 mt-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-[#0093cb] w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blog posts by title or content..."
            className="w-full pl-10 p-3 rounded-lg border-2 border-[#0093cb] focus:outline-none focus:ring-2 focus:ring-[#0093cb] transition-shadow"
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="px-6 lg:px-20 py-12">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id || index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                initial="hidden"
                animate="visible"
                variants={cardAnimation}
                transition={{ delay: index * 0.1 }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#0093cb]">{post.title}</h3>
                  <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className="text-sm text-[#0093cb] hover:underline"
                      onClick={() => setExpandedPost(post)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            No blog posts found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Modal for Expanded Post */}
      {expandedPost && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedPost(null)}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-lg p-6 relative overflow-y-auto max-h-[80vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setExpandedPost(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-[#0093cb] mb-2">{expandedPost.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(expandedPost.createdAt).toLocaleDateString()}
            </p>
            {expandedPost.imageUrl && (
              <img
                src={expandedPost.imageUrl}
                alt={expandedPost.title}
                className="w-full h-64 object-cover rounded mb-6"
              />
            )}
            <p className="text-gray-800 whitespace-pre-wrap">{expandedPost.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
