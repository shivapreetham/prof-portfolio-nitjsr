"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "../../../Provider";
import { trackPhotoView } from "@/hooks/useAnalytics";

const PhotoGalleryPage = () => {
  const { userData } = useUser();
  const photos = [...(userData?.photos || [])].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );
  const [currentIndex, setCurrentIndex] = useState(null);

  const openModal = (index) => {
    setCurrentIndex(index);
    const photo = photos[index];
    trackPhotoView(photo._id, photo.caption || `Photo ${index + 1}`);
  };

  const closeModal = () => setCurrentIndex(null);

  const showPrev = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + photos.length - 1) % photos.length;
    setCurrentIndex(newIndex);
    const photo = photos[newIndex];
    trackPhotoView(photo._id, photo.caption || `Photo ${newIndex + 1}`);
  };

  const showNext = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(newIndex);
    const photo = photos[newIndex];
    trackPhotoView(photo._id, photo.caption || `Photo ${newIndex + 1}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Photo Gallery</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Photo Gallery</h1>
          <div className="h-[3px] w-16 sm:w-20 md:w-24 lg:w-28 bg-[#0284C7] rounded-full"></div>
          <p className="text-gray-600 mt-4">A glimpse into various moments and events.</p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo._id || index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
              onClick={() => openModal(index)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>

      {currentIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex flex-col z-50 p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white p-2 z-10"
          >
            <X size={28} />
          </button>
          
          {/* Caption at top - fixed height container */}
          <div className="h-16 flex items-center justify-center mb-4">
            {photos[currentIndex].caption && (
              <div className="bg-black/60 text-white px-6 py-3 text-center rounded max-w-4xl">
                {photos[currentIndex].caption}
              </div>
            )}
          </div>

          {/* Main image container - constrained to viewport */}
          <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden">
            <button
              onClick={showPrev}
              className="absolute left-4 text-white p-2 z-10 hover:bg-black/30 rounded-full transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            <img
              src={photos[currentIndex].imageUrl}
              alt={photos[currentIndex].caption || ''}
              className="max-h-[calc(100vh-200px)] max-w-[calc(100vw-100px)] object-contain rounded"
            />
            <button
              onClick={showNext}
              className="absolute right-4 text-white p-2 z-10 hover:bg-black/30 rounded-full transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Thumbnails at bottom - fixed height */}
          <div className="h-20 flex items-center justify-center mt-4">
            <div className="flex justify-center overflow-x-auto gap-2 max-w-full px-4">
              {photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p.imageUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    trackPhotoView(p._id, p.caption || `Photo ${idx + 1}`);
                  }}
                  className={`h-16 w-16 object-cover rounded cursor-pointer flex-shrink-0 transition-all ${idx === currentIndex ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryPage;

