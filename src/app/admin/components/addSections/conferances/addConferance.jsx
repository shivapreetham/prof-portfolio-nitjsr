'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AddConference = ({ isOpen, onClose, editingConference, onConferenceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    paperPresented: false,
    description: '',
    linksText: ''
  });

  useEffect(() => {
    if (editingConference) {
      setFormData({
        name: editingConference.name || '',
        location: editingConference.location || '',
        date: new Date(editingConference.date).toISOString().split('T')[0],
        paperPresented: editingConference.paperPresented || false,
        description: editingConference.description || '',
        linksText: Array.isArray(editingConference.links) ? editingConference.links.join('\n') : ''
      });
    } else {
      setFormData({
        name: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        paperPresented: false,
        description: '',
        linksText: ''
      });
    }
  }, [editingConference]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error('Conference name and location are required');
      return;
    }

    const links = formData.linksText
      .split('\n')
      .map(link => link.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      location: formData.location,
      date: formData.date,
      paperPresented: formData.paperPresented,
      description: formData.description,
      links
    };

    try {
      if (editingConference) {
        // Update existing conference via API
        const response = await fetch(`/api/conferences/${editingConference._id || editingConference.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update conference');
        }
      } else {
        // Create new conference via API
        const response = await fetch('/api/conferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to add conference');
        }
      }
      
      onConferenceAdded();
      onClose();
    } catch (error) {
      console.error('Error saving conference:', error);
      toast.error('Failed to save conference');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-zinc-900 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingConference ? 'Edit Conference' : 'Add New Conference'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Conference Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-sm input-bordered w-full"
              placeholder="Enter conference name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Location</span>
            </label>
            <input
              type="text"
              name="location"
              className="input input-sm input-bordered w-full"
              placeholder="Enter conference location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Conference Date</span>
            </label>
            <label className="input input-sm input-bordered flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                name="date"
                className="grow bg-transparent outline-none text-sm"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Paper Presented</span>
              <input
                type="checkbox"
                name="paperPresented"
                className="checkbox"
                checked={formData.paperPresented}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-sm textarea-bordered w-full"
              placeholder="Add a short description or summary"
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

          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-sm btn-primary"
            >
              {editingConference ? 'Save Changes' : 'Add Conference'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConference;
