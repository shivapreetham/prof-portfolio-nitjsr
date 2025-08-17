'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const usePhotos = () => {
  const [photosList, setPhotosList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getPhotosList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/photos');
      if (!res.ok) throw new Error('Failed to fetch photos');
      const data = await res.json();
      setPhotosList(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to fetch photos');
      toast.error('Failed to fetch photos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPhotosList();
  }, []);

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setIsAddModalOpen(true);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      toast.success('Photo deleted successfully!');
      getPhotosList();
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error('Failed to delete photo');
    }
  };

  const handlePhotoAdded = () => {
    getPhotosList();
    setEditingPhoto(null);
    setIsAddModalOpen(false);
    toast.success('Photo saved successfully!');
  };

  const openAddModal = () => {
    setEditingPhoto(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingPhoto(null);
  };

  return {
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
  };
};

export default usePhotos;

