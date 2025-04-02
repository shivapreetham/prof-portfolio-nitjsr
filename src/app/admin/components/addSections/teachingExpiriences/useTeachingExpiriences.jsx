'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useTeachingExperiences = () => {
  const [experiencesList, setExperiencesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getExperiencesList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/teaching-experiences');
      setExperiencesList(response.data);
    } catch (err) {
      console.error('Error fetching teaching experiences:', err);
      setError('Failed to fetch teaching experiences');
      toast.error('Failed to fetch teaching experiences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExperiencesList();
  }, []);

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsAddModalOpen(true);
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      await axios.delete(`/api/teaching-experiences/${experienceId}`);
      toast.success('Experience deleted successfully!');
      getExperiencesList();
    } catch (err) {
      console.error('Error deleting experience:', err);
      toast.error('Failed to delete experience');
    }
  };

  const handleExperienceAdded = () => {
    getExperiencesList();
    setEditingExperience(null);
    setIsAddModalOpen(false);
    toast.success('Experience saved successfully!');
  };

  const openAddModal = () => {
    setEditingExperience(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingExperience(null);
  };

  return {
    experiencesList,
    isLoading,
    error,
    editingExperience,
    isAddModalOpen,
    handleEditExperience,
    handleDeleteExperience,
    handleExperienceAdded,
    getExperiencesList,
    openAddModal,
    closeAddModal,
  };
};

export default useTeachingExperiences;
