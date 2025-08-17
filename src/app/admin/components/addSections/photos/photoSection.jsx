import { Images } from 'lucide-react';
import React from 'react';
import { usePhotos } from './usePhotos';
import { AddPhoto } from './addPhoto';
import { PhotoList } from './photoList';
import { Toaster } from 'react-hot-toast';

export const PhotoSection = () => {
  const {
    photosList,
    isLoading,
    error,
    editingPhoto,
    isAddModalOpen,
    handleEditPhoto,
    handleDeletePhoto,
    handlePhotoAdded,
    getPhotosList,
    openAddModal,
    closeAddModal,
  } = usePhotos();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Images className="w-6 h-6" />
          Photo Gallery
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Photo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading photos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getPhotosList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <PhotoList photosList={photosList} onEdit={handleEditPhoto} onDelete={handleDeletePhoto} />
      )}

      {isAddModalOpen && (
        <AddPhoto
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingPhoto={editingPhoto}
          onPhotoAdded={handlePhotoAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};

export default PhotoSection;

