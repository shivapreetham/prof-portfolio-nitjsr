'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';

export const AddPhoto = ({ isOpen, onClose, editingPhoto, onPhotoAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    order: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (editingPhoto) {
      setFormData({
        title: editingPhoto.title || '',
        caption: editingPhoto.caption || '',
        order: editingPhoto.order || '',
        imageUrl: editingPhoto.imageUrl || ''
      });
    } else {
      setFormData({ title: '', caption: '', order: '', imageUrl: '' });
    }
  }, [editingPhoto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file, {
        bucketName: 'profile-images',
        folderPath: 'gallery/photos'
      });
      if (result.success) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Image is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = editingPhoto ? `/api/photos/${editingPhoto._id || editingPhoto.id}` : '/api/photos';
      const method = editingPhoto ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error(editingPhoto ? 'Failed to update photo' : 'Failed to create photo');
      }
      await res.json();
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
          <h3 className="card-title text-base mb-2">{editingPhoto ? 'Edit Photo' : 'Add Photo'}</h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Image</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
            />
            <div
              className="relative border-2 border-dashed border-accent/30 rounded-lg p-2 cursor-pointer hover:border-accent/50 transition-colors"
              style={{ height: '160px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Photo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <span className="text-xs mt-2">Click to upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm">Caption</span>
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
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
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="btn btn-ghost mr-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhoto;

