'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const usePhotos = () => {
  const [photosList, setPhotosList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    setIsEditModalOpen(true);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      setDeletingId(photoId);
      const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      toast.success('Photo deleted successfully!');
      getPhotosList();
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error('Failed to delete photo');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePhotoAdded = () => {
    getPhotosList();
    setIsAddModalOpen(false);
    toast.success('Photo saved successfully!');
  };

  const handlePhotoUpdated = () => {
    getPhotosList();
    setEditingPhoto(null);
    setIsEditModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPhoto(null);
  };

  return {
    photosList,
    isLoading,
    error,
    editingPhoto,
    isAddModalOpen,
    isEditModalOpen,
    handleEditPhoto,
    handleDeletePhoto,
    deletingId,
    handlePhotoAdded,
    handlePhotoUpdated,
    getPhotosList,
    openAddModal,
    closeAddModal,
    closeEditModal,
  };
};

export default usePhotos;

