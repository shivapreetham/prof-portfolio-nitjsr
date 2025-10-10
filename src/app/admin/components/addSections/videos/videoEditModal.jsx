'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const VideoEditModal = ({ isOpen, onClose, video, onVideoUpdated }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toYouTubeEmbedUrl = (raw) => {
    if (!raw) return '';
    try {
      const url = new URL(raw.trim());
      const host = url.hostname.replace(/^www\./, '');
      let id = '';

      if (host === 'youtu.be') {
        id = url.pathname.slice(1);
      } else if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (url.pathname.startsWith('/watch')) {
          id = url.searchParams.get('v') || '';
        } else if (url.pathname.startsWith('/embed/')) {
          id = url.pathname.split('/').pop();
        } else if (url.pathname.startsWith('/shorts/')) {
          id = url.pathname.split('/').pop();
        }
      }

      if (!/^[\w-]{6,}$/.test(id)) return '';

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
    if (video) {
      setTitle(video.title || '');
      setDate(
        video.date
          ? new Date(video.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = `/api/videos/${video._id || video.id}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date,
          videoUrl: video.videoUrl || '',
          youtubeUrl: video.youtubeUrl || '',
        }),
      });

      if (!res.ok) throw new Error('Failed to update video');

      toast.success('Video updated successfully!');
      onVideoUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error(error.message || 'Failed to update video');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="text-xl font-semibold">Edit Video</h3>
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
              <div className="w-full md:w-80 aspect-video rounded-lg overflow-hidden bg-black">
                {video.youtubeUrl ? (
                  <iframe
                    src={toYouTubeEmbedUrl(video.youtubeUrl) || video.youtubeUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={video.title || 'Video'}
                  ></iframe>
                ) : video.videoUrl ? (
                  <video src={video.videoUrl} className="w-full h-full object-cover" controls />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No preview available
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered"
                  placeholder="Enter video title..."
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

export default VideoEditModal;
