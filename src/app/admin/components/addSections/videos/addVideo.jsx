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
    videoUrl: '',   // R2-uploaded file URL
    youtubeUrl: ''  // we will normalize this to an EMBED url
  });

  // ---- helper: normalize any YT url (watch / youtu.be / share) → embed url
  const toYouTubeEmbedUrl = (raw) => {
    if (!raw) return '';
    try {
      const url = new URL(raw.trim());
      const host = url.hostname.replace(/^www\./, '');
      let id = '';

      if (host === 'youtu.be') {
        // https://youtu.be/<id>(?t=..)
        id = url.pathname.slice(1);
      } else if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (url.pathname.startsWith('/watch')) {
          id = url.searchParams.get('v') || '';
        } else if (url.pathname.startsWith('/embed/')) {
          id = url.pathname.split('/').pop();
        } else if (url.pathname.startsWith('/shorts/')) {
          id = url.pathname.split('/').pop(); // shorts to embed works too
        }
      }

      // Basic sanity check
      if (!/^[\w-]{6,}$/.test(id)) return '';

      // Preserve a start time if present (?t=30 or ?start=30)
      const start =
        url.searchParams.get('t') || url.searchParams.get('start') || '';
      const startParam =
        start && /^\d+s?$/.test(start) ? `?start=${parseInt(start, 10)}` : '';

      return `https://www.youtube.com/embed/${id}${startParam}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title || '',
        description: editingVideo.description || '',
        order: editingVideo.order || '',
        videoUrl: editingVideo.videoUrl || '',
        // normalize any stored yt link to embed for safety
        youtubeUrl: toYouTubeEmbedUrl(editingVideo.youtubeUrl || '') || (editingVideo.youtubeUrl || '')
      });
    } else {
      setFormData({ title: '', description: '', order: '', videoUrl: '', youtubeUrl: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // when typing YouTube URL, normalize to EMBED and clear uploaded file URL
    if (name === 'youtubeUrl') {
      const embed = toYouTubeEmbedUrl(value);
      setFormData((prev) => ({
        ...prev,
        youtubeUrl: embed || value, // keep raw while user is typing if invalid
        videoUrl: embed ? '' : prev.videoUrl
      }));
      return;
    }

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
        setFormData((prev) => ({
          ...prev,
          videoUrl: result.url,
          youtubeUrl: '' // clear YouTube if uploading a file
        }));
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

    // prefer R2 file OR a valid embed url
    const hasR2 = !!formData.videoUrl;
    const ytEmbed = toYouTubeEmbedUrl(formData.youtubeUrl);
    const hasYT = !!ytEmbed;

    if (!hasR2 && !hasYT) {
      toast.error('Provide a video file or a valid YouTube URL');
      return;
    }

    const payload = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      order: formData.order ? Number(formData.order) : undefined,
      // store one of these; keep both fields if your API expects both
      videoUrl: hasR2 ? formData.videoUrl : '',
      youtubeUrl: hasYT ? ytEmbed : '' // always store EMBED url
    };

    setIsSubmitting(true);
    try {
      const endpoint = editingVideo ? `/api/videos/${editingVideo._id || editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(editingVideo ? 'Failed to update video' : 'Failed to create video');
      }
      await res.json();
      onVideoAdded?.();
      onClose?.();
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

          {/* Upload to R2 */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Upload Video (R2)</span>
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

          {/* Or YouTube URL (short or normal) */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm">or YouTube URL (watch / youtu.be)</span>
            </label>
            <input
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="Paste YouTube URL"
              className="input input-bordered"
            />
            {/* Preview embed if valid */}
            {toYouTubeEmbedUrl(formData.youtubeUrl) && !formData.videoUrl && (
              <div className="mt-2 rounded overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={toYouTubeEmbedUrl(formData.youtubeUrl)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="YouTube preview"
                  />
                </div>
              </div>
            )}
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
