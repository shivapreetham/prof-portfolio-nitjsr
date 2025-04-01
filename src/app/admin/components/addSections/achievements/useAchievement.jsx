'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Achievement } from '@/models/models';

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

      // Fetch achievements sorted by date descending
      const achievementListData = await Achievement.find().sort({ date: -1 });
      setAchievementList(achievementListData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to fetch achievements');
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
      await Achievement.findByIdAndDelete(achievementId);
      toast.success('Achievement deleted successfully');
      getAchievementList();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Failed to delete achievement');
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
