'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Upload, Image, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';
import { uploadMedia } from '@/utils/uploadMedia';

export const AddBlogPost = ({ isOpen, onClose, editingPost, onPostAdded }) => {
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    mediaFiles: []
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        imageUrl: editingPost.imageUrl || '',
        mediaFiles: editingPost.mediaFiles || []
      });
    } else {
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        mediaFiles: []
      });
    }
  }, [editingPost]);

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
        folderPath: 'blog-posts'
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

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => 
        uploadMedia(file, {
          bucketName: 'media',
          folderPath: 'blog-posts'
        })
      );
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (successfulUploads.length > 0) {
        const newMediaFiles = successfulUploads.map(result => ({
          type: result.type,
          url: result.url,
          filename: result.filename,
          size: result.size,
          mimeType: result.mimeType
        }));
        
        setFormData((prev) => ({
          ...prev,
          mediaFiles: [...prev.mediaFiles, ...newMediaFiles]
        }));
        
        toast.success(`${successfulUploads.length} file(s) uploaded successfully!`);
      }

      if (failedUploads.length > 0) {
        failedUploads.forEach(result => {
          toast.error(result.error || 'Failed to upload file');
        });
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media files');
    } finally {
      setIsUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = editingPost ? `/api/posts/${editingPost._id || editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "1", // Replace with dynamic user ID if needed
          ...formData
        })
      });
      if (!response.ok) {
        throw new Error(editingPost ? 'Failed to update post' : 'Failed to create post');
      }
      await response.json();
      onPostAdded();
      onClose();
      toast.success(editingPost ? 'Post updated successfully!' : 'Post published successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save post');
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
            {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Featured Image</span>
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
                <img
                  src={formData.imageUrl}
                  alt="Blog post featured image"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <p className="mt-1 text-xs text-base-content/60">
                    Upload featured image
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Additional Media (Images & Videos)</span>
            </label>
            <input
              type="file"
              ref={mediaInputRef}
              onChange={handleMediaUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg"
              multiple
              disabled={isUploading}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline w-full"
              onClick={() => mediaInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Add Images & Videos'}
            </button>
            
            {formData.mediaFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {formData.mediaFiles.map((file, index) => (
                  <div key={index} className="relative group border rounded-lg overflow-hidden">
                    {file.type === 'image' ? (
                      <div className="relative">
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Image className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={file.url}
                          className="w-full h-20 object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-1 right-1 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="p-1">
                      <p className="text-xs truncate">{file.filename}</p>
                      <p className="text-xs text-base-content/60">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Content</span>
            </label>
            <textarea
              name="content"
              className="textarea textarea-bordered w-full h-48"
              placeholder="Write your blog post content..."
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-sm btn-primary"
              disabled={isUploading || isSubmitting}
            >
              {(isUploading || isSubmitting) && <span className="loading loading-spinner loading-xs"></span>}
              {editingPost ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogPost;
