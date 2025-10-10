'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';

export const AddStudent = ({ isOpen, onClose, editingStudent, onStudentSaved }) => {
  const fileInputRef = useRef(null);
  const previousImageRef = useRef('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    research_topic: '',
    name_of_student: '',
    completion_year: '',
    heading: '',
    student_type: 'masters',
    image_url: ''
  });

  useEffect(() => {
    if (editingStudent) {
      const existingImage = editingStudent.image_url || editingStudent.imageUrl || '';
      setFormData({
        id: editingStudent.id?.toString() || '',
        research_topic: editingStudent.research_topic || editingStudent.projectTitle || '',
        name_of_student: editingStudent.name_of_student || editingStudent.name || '',
        completion_year: editingStudent.completion_year || editingStudent.endDate?.split?.('T')?.[0] || '',
        heading: editingStudent.heading?.toString() || editingStudent.id?.toString() || '',
        student_type: (editingStudent.student_type || 'masters').toLowerCase(),
        image_url: existingImage
      });
      setImageFile(null);
      setImagePreview(existingImage);
      previousImageRef.current = existingImage;
    } else {
      setFormData({
        id: '',
        research_topic: '',
        name_of_student: '',
        completion_year: '',
        heading: '',
        student_type: 'masters',
        image_url: ''
      });
      setImageFile(null);
      setImagePreview('');
      previousImageRef.current = '';
    }
  }, [editingStudent]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData((prev) => ({ ...prev, image_url: '' }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = ['name_of_student', 'research_topic', 'id', 'heading', 'student_type'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error('Please complete all required fields.');
      return;
    }

    const numericHeading = Number(formData.heading);
    if (Number.isNaN(numericHeading)) {
      toast.error('Heading must be a number.');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = formData.image_url;

    try {
      if (imageFile) {
        setIsUploading(true);
        try {
          const result = await uploadImage(imageFile, {
            bucketName: 'student-images',
            folderPath: 'students'
          });
          if (!result.success) {
            throw new Error(result.error || 'Failed to upload image');
          }
          finalImageUrl = result.url;
        } finally {
          setIsUploading(false);
        }
      }

      const endpoint = editingStudent
        ? `/api/students/${editingStudent._id}`
        : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        heading: numericHeading,
        student_type: formData.student_type.toLowerCase(),
        image_url: finalImageUrl || undefined
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(editingStudent ? 'Update failed' : 'Create failed');
      }

      await response.json();

      if (editingStudent && imageFile) {
        const previousImage = previousImageRef.current;
        if (previousImage && previousImage !== finalImageUrl) {
          try {
            const deleteResponse = await fetch('/api/cloudFlare/deleteImage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: previousImage })
            });
            if (!deleteResponse.ok) {
              throw new Error('Failed to delete previous image');
            }
          } catch (deleteError) {
            console.error('Failed to delete previous image:', deleteError);
          }
        }
      }

      previousImageRef.current = finalImageUrl || '';
      setImageFile(null);
      setImagePreview(finalImageUrl || '');

      onStudentSaved();
      onClose();
      toast.success(editingStudent ? 'Student updated!' : 'Student added!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="card bg-base-300 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

          {/* Image Upload */}
          <div className="form-control w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
              accept="image/jpeg,image/png"
              disabled={isUploading}
            />
            <div
              className="relative border-2 border-dashed border-accent/30 rounded-lg p-2 cursor-pointer"
              style={{ height: '160px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm" />
                </div>
              ) : (imagePreview || formData.image_url) ? (
                <img
                  src={imagePreview || formData.image_url}
                  alt="student"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-6 h-6 opacity-40" />
                  <p className="mt-1 text-xs text-base-content/60">Upload photo</p>
                </div>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="form-control w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="id"
              placeholder="Student ID"
              value={formData.id}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="number"
              name="heading"
              placeholder="Heading"
              value={formData.heading}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="text"
              name="name_of_student"
              placeholder="Name of Student"
              value={formData.name_of_student}
              onChange={handleInputChange}
              className="input input-sm input-bordered md:col-span-2"
              required
            />
          </div>

          <div className="form-control w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="research_topic"
              placeholder="Research Topic"
              value={formData.research_topic}
              onChange={handleInputChange}
              className="input input-sm input-bordered md:col-span-2"
              required
            />
            <input
              type="text"
              name="completion_year"
              placeholder="Completion Year"
              value={formData.completion_year}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <select
              name="student_type"
              value={formData.student_type}
              onChange={handleInputChange}
              className="select select-sm select-bordered"
              required
            >
              <option value="masters">Masters Student</option>
              <option value="phd">PhD Student</option>
              <option value="bachelor">Bachelor Student</option>
            </select>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-6 pt-4 border-t border-base-content/10">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading || isSubmitting}>
              {(isUploading || isSubmitting) && <span className="loading loading-spinner loading-sm" />}
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
