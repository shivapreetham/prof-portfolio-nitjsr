'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useAchievements = () => {
  const [achievementList, setAchievementList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getAchievementList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/achievements');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch achievements');
      }
      
      const data = await response.json();
      setAchievementList(data.achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError(error.message || 'Failed to fetch achievements');
      toast.error('Could not load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAchievementList();
  }, []);

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setIsAddModalOpen(true);
  };

  const handleDeleteAchievement = async (achievementId) => {
    try {
      const response = await fetch(`/api/achievements/${achievementId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete achievement');
      }
      
      toast.success('Achievement deleted successfully');
      getAchievementList();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error(error.message || 'Failed to delete achievement');
    }
  };

  const handleAchievementAdded = () => {
    getAchievementList();
    setEditingAchievement(null);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setEditingAchievement(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAchievement(null);
  };

  return {
    achievementList,
    isLoading,
    error,
    editingAchievement,
    isAddModalOpen,
    handleEditAchievement,
    handleDeleteAchievement,
    handleAchievementAdded,
    getAchievementList,
    openAddModal,
    closeAddModal
  };
};

export default useAchievements;