'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage';

export const AddStudent = ({ isOpen, onClose, editingStudent, onStudentSaved }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    branch: '',
    projectTitle: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    bio: ''
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        course: editingStudent.course || '',
        branch: editingStudent.branch || '',
        projectTitle: editingStudent.projectTitle || '',
        projectDescription: editingStudent.projectDescription || '',
        startDate: editingStudent.startDate?.split('T')[0] || '',
        endDate: editingStudent.endDate?.split('T')[0] || '',
        imageUrl: editingStudent.imageUrl || '',
        bio: editingStudent.bio || ''
      });
    } else {
      setFormData({
        name: '',
        course: '',
        branch: '',
        projectTitle: '',
        projectDescription: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        bio: ''
      });
    }
  }, [editingStudent]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadImage(file, {
        bucketName: 'student-images',
        folderPath: 'students'
      });
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
        toast.success('Image uploaded!');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // minimal validation
    if (!formData.name || !formData.projectTitle) {
      toast.error('Name and project title are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = editingStudent
        ? `/api/students/${editingStudent._id}`
        : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(editingStudent ? 'Update failed' : 'Create failed');
      await res.json();
      onStudentSaved();
      onClose();
      toast.success(editingStudent ? 'Student updated!' : 'Student added!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>

          {/* Image Upload */}
          <div className="form-control w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
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
              ) : formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
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

          {/* Name, Course, Branch */}
          <div className="form-control w-full grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="text"
              name="course"
              placeholder="Course (e.g., B.Tech)"
              value={formData.course}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch (e.g., CSE)"
              value={formData.branch}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
          </div>

          {/* Project Title & Description */}
          <div className="form-control w-full">
            <input
              type="text"
              name="projectTitle"
              placeholder="Project Title"
              value={formData.projectTitle}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <textarea
              name="projectDescription"
              placeholder="Project Description"
              value={formData.projectDescription}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24 mt-2"
            />
          </div>

          {/* Timeline */}
          <div className="form-control w-full grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="input input-sm input-bordered"
              required
            />
          </div>

          {/* Bio */}
          <div className="form-control w-full">
            <textarea
              name="bio"
              placeholder="Short Bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-28"
            />
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-4">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary" disabled={isUploading || isSubmitting}>
              {(isUploading || isSubmitting) && <span className="loading loading-spinner loading-xs" />} 
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
