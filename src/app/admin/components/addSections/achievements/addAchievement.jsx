'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const AddAchievement = ({ isOpen, onClose, editingAchievement, onAchievementAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAchievement) {
      setFormData({
        title: editingAchievement.title || '',
        description: editingAchievement.description || '',
        date: new Date(editingAchievement.date).toISOString().split('T')[0] || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: ''
      });
    }
  }, [editingAchievement]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = editingAchievement 
        ? `/api/achievements/${editingAchievement._id || editingAchievement.id}` 
        : '/api/achievements';
      
      const method = editingAchievement ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(editingAchievement 
        ? 'Achievement updated successfully!' 
        : 'Achievement added successfully!'
      );
      
      onAchievementAdded();
      onClose();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error(error.message || 'Failed to save achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-zinc-900 shadow-lg max-w-full mt-5">
      <div className="card-body bg-zinc-900 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter achievement title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered textarea-sm w-full h-20"
              placeholder="Enter achievement description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Date</span>
            </label>
            <input
              type="date"
              name="date"
              className="input input-sm input-bordered w-full"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-sm btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingAchievement ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAchievement;