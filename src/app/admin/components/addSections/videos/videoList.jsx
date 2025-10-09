import React, { useState } from 'react';
import { Edit, Trash2, Play } from 'lucide-react';

export const VideoList = ({ videosList, onEdit, onDelete, deletingId }) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 6;

  if (!videosList || videosList.length === 0) {
    return <p className="text-center py-8 text-base-content/60">No videos found</p>;
  }

  const displayedVideos = showAll ? videosList : videosList.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = videosList.length > INITIAL_DISPLAY_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedVideos.map((video) => (
          <div key={video._id} className="group relative bg-base-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="aspect-video relative bg-black">
              {video.youtubeUrl ? (
                <iframe
                  src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title || 'Video'}
                ></iframe>
              ) : video.videoUrl ? (
                <video src={video.videoUrl} className="w-full h-full object-cover" controls />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Play className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn btn-xs btn-circle bg-white hover:bg-gray-100 border-none shadow-md"
                  onClick={() => onEdit(video)}
                  title="Edit"
                >
                  <Edit className="w-3 h-3 text-gray-700" />
                </button>
                <button
                  className="btn btn-xs btn-circle bg-white hover:bg-red-100 border-none shadow-md"
                  onClick={() => onDelete(video._id)}
                  disabled={deletingId === video._id}
                  title="Delete"
                >
                  {deletingId === video._id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-3 h-3 text-red-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-base-content line-clamp-2 min-h-[2.5rem]">
                {video.title || 'No title'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show More (${videosList.length - INITIAL_DISPLAY_COUNT} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList;

