'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AddAward = ({ isOpen, onClose, editingAward, onAwardAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingAward) {
      setFormData({
        title: editingAward.title || '',
        organization: editingAward.organization || '',
        date: new Date(editingAward.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingAward]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) {
      toast.error('Title and organization are required');
      return;
    }
    try {
      if (editingAward) {
        await axios.put(`/api/awards/${editingAward._id}`, formData);
      } else {
        await axios.post('/api/awards', formData);
      }
      onAwardAdded();
      onClose();
      toast.success('Award saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save award');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingAward ? 'Edit Award' : 'Add Award'}
          </h3>
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter award title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Organization</span>
            </label>
            <input
              type="text"
              name="organization"
              className="input input-sm input-bordered w-full"
              placeholder="Enter organization"
              value={formData.organization}
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
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary">
              {editingAward ? 'Save Changes' : 'Add Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
