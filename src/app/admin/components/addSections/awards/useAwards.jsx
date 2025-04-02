'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useAwards = () => {
  const [awardsList, setAwardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAward, setEditingAward] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getAwardsList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/awards');
      setAwardsList(response.data);
    } catch (err) {
      console.error('Error fetching awards:', err);
      setError('Failed to fetch awards');
      toast.error('Failed to fetch awards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAwardsList();
  }, []);

  const handleEditAward = (award) => {
    setEditingAward(award);
    setIsAddModalOpen(true);
  };

  const handleDeleteAward = async (awardId) => {
    try {
      await axios.delete(`/api/awards/${awardId}`);
      toast.success('Award deleted successfully!');
      getAwardsList();
    } catch (err) {
      console.error('Error deleting award:', err);
      toast.error('Failed to delete award');
    }
  };

  const handleAwardAdded = () => {
    getAwardsList();
    setEditingAward(null);
    setIsAddModalOpen(false);
    toast.success('Award saved successfully!');
  };

  const openAddModal = () => {
    setEditingAward(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAward(null);
  };

  return {
    awardsList,
    isLoading,
    error,
    editingAward,
    isAddModalOpen,
    handleEditAward,
    handleDeleteAward,
    handleAwardAdded,
    getAwardsList,
    openAddModal,
    closeAddModal,
  };
};

export default useAwards;
