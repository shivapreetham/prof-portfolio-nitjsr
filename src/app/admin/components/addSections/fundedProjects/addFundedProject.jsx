'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AddFundedProject = ({ isOpen, onClose, editingProject, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    fundingAgency: '',
    amount: '',
    duration: '',
    projectType: 'Sponsored',
    description: '',
    collaborators: '',
    status: 'Ongoing',
    linksText: ''
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        role: editingProject.role || '',
        fundingAgency: editingProject.fundingAgency || '',
        amount: editingProject.amount || '',
        duration: editingProject.duration || '',
        projectType: editingProject.projectType || 'Sponsored',
        description: editingProject.description || '',
        collaborators: editingProject.collaborators || '',
        status: editingProject.status || 'Ongoing',
        linksText: Array.isArray(editingProject.links) ? editingProject.links.join('\n') : ''
      });
    } else {
      setFormData({
        title: '',
        role: '',
        fundingAgency: '',
        amount: '',
        duration: '',
        projectType: 'Sponsored',
        description: '',
        collaborators: '',
        status: 'Ongoing',
        linksText: ''
      });
    }
  }, [editingProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fundingAgency) {
      toast.error('Title and funding agency are required');
      return;
    }

    const links = formData.linksText
      .split('\n')
      .map(link => link.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      role: formData.role,
      fundingAgency: formData.fundingAgency,
      amount: formData.amount,
      duration: formData.duration,
      projectType: formData.projectType,
      description: formData.description,
      collaborators: formData.collaborators,
      status: formData.status,
      links
    };

    try {
      if (editingProject) {
        await axios.put(`/api/funded-projects/${editingProject._id}`, payload);
        toast.success('Funded project updated successfully');
      } else {
        await axios.post('/api/funded-projects', payload);
        toast.success('Funded project added successfully');
      }
      onProjectAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save funded project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="card bg-base-300 shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">
                {editingProject ? 'Edit Funded Project' : 'Add Funded Project'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Project Title</span>
              </label>
              <input
                type="text"
                name="title"
                className="input input-sm input-bordered w-full"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Role</span>
                </label>
                <input
                  type="text"
                  name="role"
                  className="input input-sm input-bordered w-full"
                  placeholder="e.g., P.I., Co-PI"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Funding Agency</span>
                </label>
                <input
                  type="text"
                  name="fundingAgency"
                  className="input input-sm input-bordered w-full"
                  placeholder="Enter funding agency"
                  value={formData.fundingAgency}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Amount</span>
                </label>
                <input
                  type="text"
                  name="amount"
                  className="input input-sm input-bordered w-full"
                  placeholder="e.g., Rs. 4,00000/="
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Duration</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  className="input input-sm input-bordered w-full"
                  placeholder="e.g., 2024-2026"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Project Type</span>
                </label>
                <select
                  name="projectType"
                  className="select select-sm select-bordered w-full"
                  value={formData.projectType}
                  onChange={handleInputChange}
                >
                  <option value="Sponsored">Sponsored</option>
                  <option value="International">International</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Status</span>
                </label>
                <select
                  name="status"
                  className="select select-sm select-bordered w-full"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Collaborators</span>
              </label>
              <input
                type="text"
                name="collaborators"
                className="input input-sm input-bordered w-full"
                placeholder="e.g., with Prof. Masahiro Takei, Chiba University, Japan"
                value={formData.collaborators}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-sm textarea-bordered w-full"
                placeholder="Additional project details"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Supporting Links</span>
                <span className="label-text-alt">One URL per line</span>
              </label>
              <textarea
                name="linksText"
                className="textarea textarea-sm textarea-bordered w-full"
                placeholder="https://example.com"
                value={formData.linksText}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {editingProject ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
