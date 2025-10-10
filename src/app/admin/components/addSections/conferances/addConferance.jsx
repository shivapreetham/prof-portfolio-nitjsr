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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="card bg-base-300 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">
                {editingConference ? 'Edit Conference' : 'Add New Conference'}
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

          <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingConference ? 'Save Changes' : 'Add Conference'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddConference;
