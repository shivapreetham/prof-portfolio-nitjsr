"use client";

import { useState } from "react";
import { useUser } from "../../../Provider";

const VideoGalleryPage = () => {
  const { userData } = useUser();
  const videos = userData?.videos || [];
  const [visible, setVisible] = useState(6);

  const loadMore = () => setVisible((v) => v + 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(0, visible).map((video, index) => (
          <div
            key={video._id || index}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            {video.youtubeUrl ? (
              <div className="aspect-video">
                <iframe
                  src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <video src={video.videoUrl} controls className="w-full h-full" />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#064A6E] mb-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              )}
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
    </div>
  );
};

export default VideoGalleryPage;

