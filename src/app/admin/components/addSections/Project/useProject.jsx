import { useState, useEffect } from 'react';
import axios from 'axios';

export const useProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getProjectList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axios.get('/api/projects');
      setProjectList(data);
    } catch (error) {
      console.error('Error fetching project list:', error);
      setError('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      toast.success('Project deleted successfully');
      getProjectList();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleProjectAdded = () => {
    getProjectList();
    setEditingProject(null);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingProject(null);
  };

  return {
    projectList,
    isLoading,
    error,
    editingProject,
    isAddModalOpen,
    handleEditProject,
    handleDeleteProject,
    handleProjectAdded,
    getProjectList,
    openAddModal,
    closeAddModal
  };
};