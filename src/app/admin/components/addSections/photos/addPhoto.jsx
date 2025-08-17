'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';

export const AddPhoto = ({ isOpen, onClose, editingPhoto, onPhotoAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (editingPhoto) {
      setPhotos([
        {
          caption: editingPhoto.caption || '',
          order: editingPhoto.order || '',
          imageUrl: editingPhoto.imageUrl || '',
        },
      ]);
    } else {
      setPhotos([]);
    }
  }, [editingPhoto]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    const uploaded = [];

    for (const file of files) {
      try {
        const result = await uploadImage(file, {
          bucketName: 'profile-images',
          folderPath: 'gallery/photos',
        });
        if (result.success) {
          uploaded.push({ caption: '', order: '', imageUrl: result.url });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(error.message || 'Failed to upload image');
      }
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoChange = (index, field, value) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, [field]: value } : photo))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPhoto && !photos[0]?.imageUrl) {
      toast.error('Image is required');
      return;
    }
    if (!editingPhoto && photos.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPhoto) {
        const endpoint = `/api/photos/${editingPhoto._id || editingPhoto.id}`;
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photos[0]),
        });
        if (!res.ok) throw new Error('Failed to update photo');
      } else {
        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photos),
        });
        if (!res.ok) throw new Error('Failed to create photos');
      }
      onPhotoAdded();
      onClose();
    } catch (error) {
      console.error('Error saving photo:', error);
      toast.error(error.message || 'Failed to save photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingPhoto ? 'Edit Photo' : 'Add Photos'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Images</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple={!editingPhoto}
              disabled={isUploading}
            />
            <div
              className="relative border-2 border-dashed border-accent/30 rounded-lg p-2 cursor-pointer hover:border-accent/50 transition-colors"
              style={{ minHeight: '160px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p, idx) => (
                    <img
                      key={idx}
                      src={p.imageUrl}
                      alt="Photo preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <span className="text-xs mt-2">Click to upload</span>
                </div>
              )}
            </div>
          </div>

          {photos.map((photo, index) => (
            <div key={index} className="space-y-3 border p-3 rounded-lg">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Caption</span>
                </label>
                <textarea
                  value={photo.caption}
                  onChange={(e) =>
                    handlePhotoChange(index, 'caption', e.target.value)
                  }
                  className="textarea textarea-bordered"
                  rows={3}
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Order</span>
                </label>
                <input
                  type="number"
                  value={photo.order}
                  onChange={(e) =>
                    handlePhotoChange(index, 'order', e.target.value)
                  }
                  className="input input-bordered"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button type="button" className="btn btn-ghost mr-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhoto;

