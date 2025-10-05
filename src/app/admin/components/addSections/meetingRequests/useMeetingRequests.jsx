'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useMeetingRequests = () => {
  const [requestsList, setRequestsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRequestsList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/meeting-requests');
      if (!response.ok) throw new Error('Failed to fetch meeting requests');
      const data = await response.json();
      setRequestsList(data);
    } catch (err) {
      console.error('Error fetching meeting requests:', err);
      setError('Failed to fetch meeting requests');
      toast.error('Failed to fetch meeting requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRequestsList();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`/api/meeting-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      toast.success(`Meeting request ${newStatus}!`);
      getRequestsList();
    } catch (err) {
      console.error('Error updating meeting request:', err);
      toast.error('Failed to update meeting request');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/meeting-requests/${requestId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete meeting request');
      toast.success('Meeting request deleted successfully!');
      getRequestsList();
    } catch (err) {
      console.error('Error deleting meeting request:', err);
      toast.error('Failed to delete meeting request');
    }
  };

  return {
    requestsList,
    isLoading,
    error,
    handleUpdateStatus,
    handleDeleteRequest,
    getRequestsList,
  };
};

export default useMeetingRequests;
