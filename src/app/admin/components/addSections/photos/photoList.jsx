import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

export const PhotoList = ({ photosList, onEdit, onDelete, deletingId }) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 6;

  if (!photosList || photosList.length === 0) {
    return <p className="text-center py-8 text-base-content/60">No photos found</p>;
  }

  const displayedPhotos = showAll ? photosList : photosList.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = photosList.length > INITIAL_DISPLAY_COUNT;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedPhotos.map((photo) => (
          <div key={photo._id} className="group relative bg-base-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="aspect-square relative">
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn btn-xs btn-circle bg-white hover:bg-gray-100 border-none shadow-md"
                  onClick={() => onEdit(photo)}
                  title="Edit"
                >
                  <Edit className="w-3 h-3 text-gray-700" />
                </button>
                <button
                  className="btn btn-xs btn-circle bg-white hover:bg-red-100 border-none shadow-md"
                  onClick={() => onDelete(photo._id)}
                  disabled={deletingId === photo._id}
                  title="Delete"
                >
                  {deletingId === photo._id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-3 h-3 text-red-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-base-content line-clamp-2 min-h-[2.5rem]">
                {photo.caption || 'No caption'}
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
            {showAll ? 'Show Less' : `Show More (${photosList.length - INITIAL_DISPLAY_COUNT} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoList;

