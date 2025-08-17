"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "../../../Provider";

const PhotoGalleryPage = () => {
  const { userData } = useUser();
  const photos = userData?.photos || [];
  const [currentIndex, setCurrentIndex] = useState(null);

  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);
  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + photos.length - 1) % photos.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo._id || index}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md border border-gray-100"
            onClick={() => openModal(index)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title || `Photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {currentIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <button
            onClick={showPrev}
            className="absolute left-4 text-white p-2"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={photos[currentIndex].imageUrl}
            alt={photos[currentIndex].title || ''}
            className="max-h-[80vh] object-contain rounded"
          />
          <button
            onClick={showNext}
            className="absolute right-4 text-white p-2"
          >
            <ChevronRight size={32} />
          </button>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white p-2"
          >
            <X size={28} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-center">
            {photos[currentIndex].caption}
          </div>
          <div className="absolute bottom-0 left-0 right-0 pb-20 flex justify-center overflow-x-auto gap-2">
            {photos.map((p, idx) => (
              <img
                key={idx}
                src={p.imageUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-16 w-16 object-cover rounded cursor-pointer ${
                  idx === currentIndex ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryPage;

