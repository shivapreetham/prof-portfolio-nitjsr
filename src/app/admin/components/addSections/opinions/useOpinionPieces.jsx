'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useOpinionPieces = () => {
  const [opinionsList, setOpinionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOpinion, setEditingOpinion] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getOpinionsList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/opinion-pieces');
      if (!response.ok) throw new Error('Failed to fetch opinion pieces');
      const data = await response.json();
      setOpinionsList(data);
    } catch (err) {
      console.error('Error fetching opinion pieces:', err);
      setError('Failed to fetch opinion pieces');
      toast.error('Failed to fetch opinion pieces');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOpinionsList();
  }, []);

  const handleEditOpinion = (opinion) => {
    setEditingOpinion(opinion);
    setIsAddModalOpen(true);
  };

  const handleDeleteOpinion = async (opinionId) => {
    try {
      const response = await fetch(`/api/opinion-pieces/${opinionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete opinion piece');
      toast.success('Opinion piece deleted successfully!');
      getOpinionsList();
    } catch (err) {
      console.error('Error deleting opinion piece:', err);
      toast.error('Failed to delete opinion piece');
    }
  };

  const handleOpinionAdded = () => {
    getOpinionsList();
    setEditingOpinion(null);
    setIsAddModalOpen(false);
    toast.success('Opinion piece saved successfully!');
  };

  const openAddModal = () => {
    setEditingOpinion(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingOpinion(null);
  };

  return {
    opinionsList,
    isLoading,
    error,
    editingOpinion,
    isAddModalOpen,
    handleEditOpinion,
    handleDeleteOpinion,
    handleOpinionAdded,
    getOpinionsList,
    openAddModal,
    closeAddModal,
  };
};

export default useOpinionPieces;
