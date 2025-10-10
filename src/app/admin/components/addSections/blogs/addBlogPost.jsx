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
    imageUrl: '', // existing image URL when editing
    mediaFiles: [] // can contain existing URLs or new File objects
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        imageUrl: editingPost.imageUrl || '',
        mediaFiles: editingPost.mediaFiles || []
      });
      setImagePreview(editingPost.imageUrl || '');
      setImageFile(null);
    } else {
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        mediaFiles: []
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [editingPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMediaSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video',
      filename: file.name,
      size: file.size,
      mimeType: file.type
    }));
    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...newFiles]
    }));
  };

  const handleRemoveMedia = (index) => {
    setFormData(prev => {
      const removed = prev.mediaFiles[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return {
        ...prev,
        mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = formData.imageUrl;
      if (imageFile) {
        setIsUploading(true);
        const imgRes = await uploadImage(imageFile, {
          bucketName: 'profile-images',
          folderPath: 'blog-posts'
        });
        if (!imgRes.success) {
          throw new Error(imgRes.error);
        }
        uploadedImageUrl = imgRes.url;
      }

      const existingMedia = formData.mediaFiles.filter(m => !m.file);
      const newMedia = formData.mediaFiles.filter(m => m.file);
      let uploadedMedia = [];
      if (newMedia.length > 0) {
        setIsUploading(true);
        const uploadPromises = newMedia.map(m =>
          uploadMedia(m.file, {
            bucketName: 'media',
            folderPath: 'blog-posts'
          })
        );
        const results = await Promise.all(uploadPromises);
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        if (successful.length > 0) {
          uploadedMedia = successful.map(r => ({
            type: r.type,
            url: r.url,
            filename: r.filename,
            size: r.size,
            mimeType: r.mimeType
          }));
        }
        if (failed.length > 0) {
          failed.forEach(r => toast.error(r.error || 'Failed to upload file'));
        }
        newMedia.forEach(m => URL.revokeObjectURL(m.preview));
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        imageUrl: uploadedImageUrl,
        mediaFiles: [...existingMedia, ...uploadedMedia]
      };

      const endpoint = editingPost ? `/api/posts/${editingPost._id || editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "1", // Replace with dynamic user ID if needed
          ...payload
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
      setIsUploading(false);
      setIsSubmitting(false);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="card bg-base-300 shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">
                {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
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
              <span className="label-text text-sm">Featured Image</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
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
              ) : imagePreview || formData.imageUrl ? (
                <img
                  src={imagePreview || formData.imageUrl}
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
              onChange={handleMediaSelect}
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
                          src={file.preview || file.url}
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
                          src={file.preview || file.url}
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

          <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading || isSubmitting}
            >
              {(isUploading || isSubmitting) && <span className="loading loading-spinner loading-sm"></span>}
              {editingPost ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlogPost;
