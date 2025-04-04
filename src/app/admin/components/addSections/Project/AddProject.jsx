'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link2, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';
import axios from 'axios';

const AddProject = ({ isOpen, onClose, editingProject, onProjectAdded }) => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    collaborators: '',
    videoUrl: '',
    banner: ''
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        collaborators: editingProject.collaborators || '',
        videoUrl: editingProject.videoUrl || '',
        banner: editingProject.banner || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        collaborators: '',
        videoUrl: '',
        banner: ''
      });
    }
  }, [editingProject]);

  const handleInputChange = (e) => {
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
        folderPath: 'projects'
      });

      if (result.success) {
        setFormData((prev) => ({ ...prev, banner: result.url }));
        toast.success('Banner uploaded successfully!');
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

  const handleVideoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Request a presigned URL from our Cloudflare R2 upload API
      const res = await fetch('/api/cloudFlare/cloudFlareUpload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Upload the video file using the presigned URL
        await fetch(data.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        // Save the public URL of the uploaded video
        setFormData((prev) => ({ ...prev, videoUrl: data.publicUrl }));
        toast.success('Video uploaded successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id || editingProject.id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await axios.post('/api/projects', {
          ...formData,
          userId: "1" // Replace with dynamic user ID if needed
        });
        toast.success('Project added successfully!');
      }
      onProjectAdded();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
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
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>

          <div className="form-control w-full">
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
              ) : formData.banner ? (
                <img
                  src={formData.banner}
                  alt="Project banner"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <p className="mt-1 text-xs text-base-content/60">
                    Upload banner
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter project title"
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
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Collaborators</span>
            </label>
            <input
              type="text"
              name="collaborators"
              className="input input-sm input-bordered w-full"
              placeholder="Enter collaborators (optional)"
              value={formData.collaborators}
              onChange={handleInputChange}
            />
          </div>

          {/* Replace the Video URL field with Video Upload */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Upload Video</span>
            </label>
            <input 
              type="file" 
              accept="video/*" 
              ref={videoInputRef}
              onChange={handleVideoUpload}
              className="mb-4"
              disabled={isUploading}
            />
            {formData.videoUrl && (
              <div className="mt-2">
                <video src={formData.videoUrl} controls className="w-full" />
              </div>
            )}
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
              disabled={isUploading || isSubmitting}
            >
              {(isUploading || isSubmitting) && <span className="loading loading-spinner loading-xs"></span>}
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
