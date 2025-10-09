'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PhotoEditModal = ({ isOpen, onClose, photo, onPhotoUpdated }) => {
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (photo) {
      setCaption(photo.caption || '');
      setDate(
        photo.date
          ? new Date(photo.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
    }
  }, [photo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = `/api/photos/${photo._id || photo.id}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          date,
          imageUrl: photo.imageUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update photo');

      toast.success('Photo updated successfully!');
      onPhotoUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast.error(error.message || 'Failed to update photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="text-xl font-semibold">Edit Photo</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-64 h-64 rounded-lg overflow-hidden bg-base-200">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Photo'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Caption</span>
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="textarea textarea-bordered h-32 resize-none"
                  placeholder="Enter photo caption..."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditModal;
