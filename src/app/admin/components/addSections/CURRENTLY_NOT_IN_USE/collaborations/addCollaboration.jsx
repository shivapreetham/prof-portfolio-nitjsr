'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AddCollaboration = ({ isOpen, onClose, editingCollaboration, onCollaborationAdded }) => {
  const [formData, setFormData] = useState({
    collaboratorName: '',
    institution: '',
    projectTitle: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  useEffect(() => {
    if (editingCollaboration) {
      setFormData({
        collaboratorName: editingCollaboration.collaboratorName || '',
        institution: editingCollaboration.institution || '',
        projectTitle: editingCollaboration.projectTitle || '',
        startDate: new Date(editingCollaboration.startDate).toISOString().split('T')[0],
        endDate: editingCollaboration.endDate ? new Date(editingCollaboration.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        collaboratorName: '',
        institution: '',
        projectTitle: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
  }, [editingCollaboration]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collaboratorName || !formData.projectTitle || !formData.startDate) {
      toast.error('Collaborator Name, Project Title, and Start Date are required');
      return;
    }
    try {
      if (editingCollaboration) {
        await axios.put(`/api/collaborations/${editingCollaboration._id}`, formData);
      } else {
        await axios.post('/api/collaborations', formData);
      }
      onCollaborationAdded();
      onClose();
      toast.success('Collaboration saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save collaboration');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingCollaboration ? 'Edit Collaboration' : 'Add Collaboration'}
          </h3>
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Collaborator Name</span>
            </label>
            <input
              type="text"
              name="collaboratorName"
              className="input input-sm input-bordered w-full"
              placeholder="Enter collaborator name"
              value={formData.collaboratorName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Institution</span>
            </label>
            <input
              type="text"
              name="institution"
              className="input input-sm input-bordered w-full"
              placeholder="Enter institution (optional)"
              value={formData.institution}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Project Title</span>
            </label>
            <input
              type="text"
              name="projectTitle"
              className="input input-sm input-bordered w-full"
              placeholder="Enter project title"
              value={formData.projectTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label py-1">
                <span className="label-text text-sm">Start Date</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="input input-sm input-bordered w-full"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-control w-1/2">
              <label className="label py-1">
                <span className="label-text text-sm">End Date</span>
              </label>
              <input
                type="date"
                name="endDate"
                className="input input-sm input-bordered w-full"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary">
              {editingCollaboration ? 'Save Changes' : 'Add Collaboration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
