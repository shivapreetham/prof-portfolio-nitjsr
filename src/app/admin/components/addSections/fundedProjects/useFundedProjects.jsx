'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const useFundedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/funded-projects');
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load funded projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/api/funded-projects/${project._id}`);
      toast.success('Funded project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete funded project');
      console.error(err);
    }
  };

  const handleSaved = () => {
    fetchProjects();
    setEditingProject(null);
  };

  const openModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return {
    projects,
    isLoading,
    error,
    editingProject,
    isModalOpen,
    handleEdit,
    handleDelete,
    handleSaved,
    fetchProjects,
    openModal,
    closeModal
  };
};
