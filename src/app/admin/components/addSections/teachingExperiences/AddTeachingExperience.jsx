'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AddTeachingExperience = ({ isOpen, onClose, editingExperience, onExperienceAdded }) => {
  const [formData, setFormData] = useState({
    subject: '',
    institution: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  useEffect(() => {
    if (editingExperience) {
      setFormData({
        subject: editingExperience.subject || '',
        institution: editingExperience.institution || '',
        startDate: new Date(editingExperience.startDate).toISOString().split('T')[0],
        endDate: editingExperience.endDate ? new Date(editingExperience.endDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        subject: '',
        institution: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
  }, [editingExperience]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.institution) {
      toast.error('Subject and Institution are required');
      return;
    }
    try {
      if (editingExperience) {
        await axios.put(`/api/teaching-experiences/${editingExperience._id}`, formData);
      } else {
        await axios.post('/api/teaching-experiences', formData);
      }
      onExperienceAdded();
      onClose();
      toast.success('Teaching experience saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save teaching experience');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="card bg-base-300 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">
                {editingExperience ? 'Edit Teaching Experience' : 'Add Teaching Experience'}
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
              <span className="label-text text-sm">Subject</span>
            </label>
            <input
              type="text"
              name="subject"
              className="input input-sm input-bordered w-full"
              placeholder="Enter subject"
              value={formData.subject}
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
              placeholder="Enter institution"
              value={formData.institution}
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
          <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingExperience ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
