"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useUser } from "../../../Provider";
import { trackVideoPlay } from "@/hooks/useAnalytics";

const VideoGalleryPage = () => {
  const { userData } = useUser();
  const videos = [...(userData?.videos || [])].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );
  const [visible, setVisible] = useState(6);

  const loadMore = () => setVisible((v) => v + 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Video Gallery</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Video Gallery</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 lg:w-28 bg-[#0284C7] rounded-full"></div>
          <p className="text-gray-600 mt-4">Collection of talks and lectures.</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, visible).map((video, index) => (
            <div
              key={video._id || index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="aspect-video bg-black">
                {video.youtubeUrl ? (
                  <iframe
                    src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    onLoad={() => trackVideoPlay(video._id, video.title)}
                  ></iframe>
                ) : (
                  <video 
                    src={video.videoUrl} 
                    controls 
                    className="w-full h-full" 
                    onPlay={() => trackVideoPlay(video._id, video.title)}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#064A6E] mb-2">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {visible < videos.length && (
          <div className="flex justify-center mt-6">
            <button onClick={loadMore} className="btn btn-primary">
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoGalleryPage;

