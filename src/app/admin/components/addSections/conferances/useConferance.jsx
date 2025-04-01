'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Conference } from '@/models/models';

export const useConferences = () => {
  const [conferencesList, setConferencesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingConference, setEditingConference] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getConferencesList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch conferences sorted by date descending using Mongoose
      const conferencesListData = await Conference.find().sort({ date: -1 });
      setConferencesList(conferencesListData);
    } catch (error) {
      console.error('Error fetching conferences list:', error);
      setError('Failed to fetch conferences');
      toast.error('Failed to fetch conferences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConferencesList();
  }, []);

  const handleEditConference = (conference) => {
    setEditingConference(conference);
    setIsAddModalOpen(true);
  };

  const handleDeleteConference = async (conferenceId) => {
    try {
      await Conference.findByIdAndDelete(conferenceId);
      toast.success('Conference deleted successfully!');
      getConferencesList();
    } catch (error) {
      console.error('Error deleting conference:', error);
      toast.error('Failed to delete conference');
    }
  };

  const handleConferenceAdded = () => {
    getConferencesList();
    setEditingConference(null);
    setIsAddModalOpen(false);
    toast.success('Conference saved successfully!');
  };

  const openAddModal = () => {
    setEditingConference(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingConference(null);
  };

  return {
    conferencesList,
    isLoading,
    error,
    editingConference,
    isAddModalOpen,
    handleEditConference,
    handleDeleteConference,
    handleConferenceAdded,
    getConferencesList,
    openAddModal,
    closeAddModal
  };
};

export default useConferences;
