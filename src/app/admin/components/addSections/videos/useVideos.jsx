'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useVideos = () => {
  const [videosList, setVideosList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getVideosList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/videos');
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setVideosList(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
      toast.error('Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVideosList();
  }, []);

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsAddModalOpen(true);
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const res = await fetch(`/api/videos/${videoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete video');
      toast.success('Video deleted successfully!');
      getVideosList();
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error('Failed to delete video');
    }
  };

  const handleVideoAdded = () => {
    getVideosList();
    setEditingVideo(null);
    setIsAddModalOpen(false);
    toast.success('Video saved successfully!');
  };

  const openAddModal = () => {
    setEditingVideo(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingVideo(null);
  };

  return {
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
  };
};

export default useVideos;

