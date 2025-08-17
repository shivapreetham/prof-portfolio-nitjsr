import { Video as VideoIcon } from 'lucide-react';
import React from 'react';
import { useVideos } from './useVideos';
import { AddVideo } from './addVideo';
import { VideoList } from './videoList';
import { Toaster } from 'react-hot-toast';

export const VideoSection = () => {
  const {
    videosList,
    isLoading,
    error,
    editingVideo,
    isAddModalOpen,
    handleEditVideo,
    handleDeleteVideo,
    handleVideoAdded,
    getVideosList,
    openAddModal,
    closeAddModal,
  } = useVideos();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <VideoIcon className="w-6 h-6" />
          Video Gallery
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Video
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading videos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getVideosList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <VideoList videosList={videosList} onEdit={handleEditVideo} onDelete={handleDeleteVideo} />
      )}

      {isAddModalOpen && (
        <AddVideo
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingVideo={editingVideo}
          onVideoAdded={handleVideoAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};

export default VideoSection;

