'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';

export const AddPhoto = ({ isOpen, onClose, editingPhoto, onPhotoAdded }) => {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPhoto) {
      setPhotos([
        {
          caption: editingPhoto.caption || '',
          date: editingPhoto.date
            ? new Date(editingPhoto.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          imageUrl: editingPhoto.imageUrl || '',
          file: null,
          preview: editingPhoto.imageUrl || '',
        },
      ]);
    } else {
      setPhotos([]);
    }
  }, [editingPhoto]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      date: new Date().toISOString().split('T')[0],
    }));

    setPhotos((prev) => [...prev, ...mapped]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoChange = (index, field, value) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, [field]: value } : photo))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPhoto && !photos[0]?.imageUrl && !photos[0]?.file) {
      toast.error('Image is required');
      return;
    }
    if (!editingPhoto && photos.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = [];
      for (const photo of photos) {
        let imageUrl = photo.imageUrl;
        if (photo.file) {
          const result = await uploadImage(photo.file, {
            bucketName: 'profile-images',
            folderPath: 'gallery/photos',
          });
          if (!result.success) throw new Error(result.error);
          imageUrl = result.url;
        }
        payload.push({
          caption: photo.caption,
          date: photo.date,
          imageUrl,
        });
      }

      if (editingPhoto) {
        const endpoint = `/api/photos/${editingPhoto._id || editingPhoto.id}`;
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload[0]),
        });
        if (!res.ok) throw new Error('Failed to update photo');
      } else {
        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
              onChange={handleFileSelect}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple={!editingPhoto}
            />
            <div
              className="relative border-2 border-dashed border-accent/30 rounded-lg p-2 cursor-pointer hover:border-accent/50 transition-colors"
              style={{ minHeight: '160px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p, idx) => (
                    <div
                      key={idx}
                      className="relative"
                      onClick={(e) => e.stopPropagation()}   // <- prevent dropzone click
                    >
                      <img
                        src={p.preview || p.imageUrl}
                        alt="Photo preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs absolute top-1 right-1"
                        onClick={(e) => {
                          e.stopPropagation();               // <- prevent dropzone click
                          setEditingIndex(idx);
                        }}
                      >
                        <Edit className="w-5 h-5 rounded-md  text-gray-950 bg-white" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs absolute top-1 left-1"
                        onClick={(e) => {
                          e.stopPropagation();               // <- prevent dropzone click
                          setPhotos((prev) => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        <Trash className="w-5 h-5 rounded-md  text-red-500 bg-white" />
                      </button>

                      {editingIndex === idx && (
                        <div
                          className="absolute inset-0 bg-base-300/90 backdrop-blur-sm p-2 rounded-lg flex flex-col"
                          onClick={(e) => e.stopPropagation()}   // <- prevent dropzone click
                        >
                          <label className="text-xs mb-1">Caption</label>
                          <textarea
                            value={p.caption}
                            onChange={(e) => handlePhotoChange(idx, 'caption', e.target.value)}
                            className="textarea textarea-bordered textarea-xs mb-2"
                            rows={2}
                            onClick={(e) => e.stopPropagation()}   // extra safety
                          />
                          <label className="text-xs mb-1">Date</label>
                          <input
                            type="date"
                            value={p.date}
                            onChange={(e) => handlePhotoChange(idx, 'date', e.target.value)}
                            className="input input-bordered input-xs mb-2"
                            onClick={(e) => e.stopPropagation()}   // extra safety
                          />
                          <button
                            type="button"
                            className="btn btn-xs self-end"
                            onClick={(e) => {
                              e.stopPropagation();                // <- prevent dropzone click
                              setEditingIndex(null);
                            }}
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>
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

          <div className="flex justify-end">
            <button type="button" className="btn btn-ghost mr-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhoto;

