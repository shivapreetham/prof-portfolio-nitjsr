'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { uploadMedia } from '@/utils/uploadMedia';

export const AddVideo = ({ isOpen, onClose, editingVideo, onVideoAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: '',
    videoUrl: '',
    youtubeUrl: ''
  });

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title || '',
        description: editingVideo.description || '',
        order: editingVideo.order || '',
        videoUrl: editingVideo.videoUrl || '',
        youtubeUrl: editingVideo.youtubeUrl || ''
      });
    } else {
      setFormData({ title: '', description: '', order: '', videoUrl: '', youtubeUrl: '' });
    }
  }, [editingVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, {
        bucketName: 'media',
        folderPath: 'gallery/videos'
      });
      if (result.success) {
        setFormData((prev) => ({ ...prev, videoUrl: result.url, youtubeUrl: '' }));
        toast.success('Video uploaded successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoUrl && !formData.youtubeUrl) {
      toast.error('Provide a video file or YouTube URL');
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = editingVideo ? `/api/videos/${editingVideo._id || editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error(editingVideo ? 'Failed to update video' : 'Failed to create video');
      }
      await res.json();
      onVideoAdded();
      onClose();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error(error.message || 'Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">{editingVideo ? 'Edit Video' : 'Add Video'}</h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Upload Video</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              className="file-input file-input-bordered w-full"
              accept="video/*"
              disabled={isUploading}
            />
            {isUploading && <span className="loading loading-spinner loading-sm mt-2"></span>}
            {formData.videoUrl && (
              <video src={formData.videoUrl} controls className="mt-2 rounded" />
            )}
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm">or YouTube URL</span>
            </label>
            <input
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              className="input input-bordered"
            />
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
              <span className="label-text text-sm">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
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

export default AddVideo;

