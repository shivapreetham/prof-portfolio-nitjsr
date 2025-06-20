'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useCollaborations = () => {
  const [collaborationsList, setCollaborationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCollaboration, setEditingCollaboration] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getCollaborationsList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/collaborations');
      setCollaborationsList(response.data);
    } catch (err) {
      console.error('Error fetching collaborations:', err);
      setError('Failed to fetch collaborations');
      toast.error('Failed to fetch collaborations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCollaborationsList();
  }, []);

  const handleEditCollaboration = (collaboration) => {
    setEditingCollaboration(collaboration);
    setIsAddModalOpen(true);
  };

  const handleDeleteCollaboration = async (collaborationId) => {
    try {
      await axios.delete(`/api/collaborations/${collaborationId}`);
      toast.success('Collaboration deleted successfully!');
      getCollaborationsList();
    } catch (err) {
      console.error('Error deleting collaboration:', err);
      toast.error('Failed to delete collaboration');
    }
  };

  const handleCollaborationAdded = () => {
    getCollaborationsList();
    setEditingCollaboration(null);
    setIsAddModalOpen(false);
    toast.success('Collaboration saved successfully!');
  };

  const openAddModal = () => {
    setEditingCollaboration(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingCollaboration(null);
  };

  return {
    collaborationsList,
    isLoading,
    error,
    editingCollaboration,
    isAddModalOpen,
    handleEditCollaboration,
    handleDeleteCollaboration,
    handleCollaborationAdded,
    getCollaborationsList,
    openAddModal,
    closeAddModal,
  };
};

export default useCollaborations;
