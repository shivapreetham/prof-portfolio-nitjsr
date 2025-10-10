'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const AddAward = ({ isOpen, onClose, editingAward, onAwardAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    linksText: ''
  });

  useEffect(() => {
    if (editingAward) {
      setFormData({
        title: editingAward.title || '',
        organization: editingAward.organization || '',
        date: new Date(editingAward.date).toISOString().split('T')[0],
        description: editingAward.description || '',
        linksText: Array.isArray(editingAward.links) ? editingAward.links.join('\n') : ''
      });
    } else {
      setFormData({
        title: '',
        organization: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        linksText: ''
      });
    }
  }, [editingAward]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Title and date are required');
      return;
    }

    const links = formData.linksText
      .split('\n')
      .map(link => link.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      organization: formData.organization,
      date: formData.date,
      description: formData.description,
      links
    };
    try {
      if (editingAward) {
        await axios.put(`/api/awards/${editingAward._id}`, payload);
      } else {
        await axios.post('/api/awards', payload);
      }
      onAwardAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save award');
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
                {editingAward ? 'Edit Award' : 'Add Award'}
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
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-sm textarea-bordered w-full"
              placeholder="Highlight the award or add notes"
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
              placeholder="https://example.com\nhttps://example.org"
              value={formData.linksText}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingAward ? 'Save Changes' : 'Add Award'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
