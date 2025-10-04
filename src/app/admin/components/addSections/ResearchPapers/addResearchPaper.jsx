'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FileText, Calendar, Upload, Link2, BookOpen, Layers, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadFile } from '@/utils/uploadFile';
import axios from 'axios';

export const AddResearchPaper = ({ isOpen, onClose, editingPaper, onPaperAdded }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'International Journal Papers',
    journalOrConference: '',
    volume: '',
    pages: '',
    pdfUrl: '',
    externalLink: '',
    authorsText: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingPaper) {
      setFormData({
        title: editingPaper.title || '',
        description: editingPaper.description || '',
        category: editingPaper.category || 'International Journal Papers',
        journalOrConference: editingPaper.journalOrConference || '',
        volume: editingPaper.volume || '',
        pages: editingPaper.pages || '',
        pdfUrl: editingPaper.pdfUrl || '',
        externalLink: editingPaper.externalLink || '',
        authorsText: Array.isArray(editingPaper.authors) ? editingPaper.authors.join('\n') : '',
        publishedAt: editingPaper.publishedAt ? new Date(editingPaper.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'International Journal Papers',
        journalOrConference: '',
        volume: '',
        pages: '',
        pdfUrl: '',
        externalLink: '',
        authorsText: '',
        publishedAt: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingPaper]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setIsUploading(true);

    try {
      const result = await uploadFile(file, {
        bucketName: 'files',
        folderPath: 'pdfs',
        maxFileSize: 20 * 1024 * 1024 // 20MB
      });
      if (result.success) {
        setFormData((prev) => ({ ...prev, pdfUrl: result.url }));
        toast.success('PDF uploaded successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.publishedAt) {
      toast.error('Title, category and publication date are required');
      return;
    }
    const authors = formData.authorsText
      .split(/\n|,/)
      .map(author => author.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      journalOrConference: formData.journalOrConference.trim() || undefined,
      volume: formData.volume.trim() || undefined,
      pages: formData.pages.trim() || undefined,
      publishedAt: formData.publishedAt,
      pdfUrl: formData.pdfUrl.trim() || undefined,
      externalLink: formData.externalLink.trim() || undefined,
      authors,
    };
    try {
      let response;
      if (editingPaper) {
        response = await axios.put(`/api/research-papers/${editingPaper._id}`, payload);
      } else {
        response = await axios.post('/api/research-papers', payload);
      }
      
      onPaperAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save paper');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card bg-base-300 shadow-lg max-w-2xl mt-5">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="card-title text-base mb-2">
            {editingPaper ? 'Edit Research Paper' : 'Add New Research Paper'}
          </h3>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-sm input-bordered w-full"
              placeholder="Enter paper title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm flex items-center gap-1"><Layers className="w-4 h-4" /> Category</span>
              </label>
              <select
                name="category"
                className="select select-sm select-bordered w-full"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="International Journal Papers">International Journal Papers</option>
                <option value="International Conference Papers">International Conference Papers</option>
                <option value="Books">Books</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm flex items-center gap-1"><BookOpen className="w-4 h-4" /> Journal / Conference</span>
              </label>
              <input
                type="text"
                name="journalOrConference"
                className="input input-sm input-bordered w-full"
                placeholder="Name of journal or conference"
                value={formData.journalOrConference}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Volume</span>
              </label>
              <input
                type="text"
                name="volume"
                className="input input-sm input-bordered w-full"
                placeholder="Volume / Issue"
                value={formData.volume}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text text-sm">Pages</span>
              </label>
              <input
                type="text"
                name="pages"
                className="input input-sm input-bordered w-full"
                placeholder="e.g., 155733-155746"
                value={formData.pages}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Summary</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered textarea-sm w-full h-32"
              placeholder="Optional summary or key highlights"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">External Link</span>
            </label>
            <input
              type="url"
              name="externalLink"
              className="input input-sm input-bordered w-full"
              placeholder="Publisher / DOI / Article URL"
              value={formData.externalLink}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm">Publication Date</span>
            </label>
            <input
              type="date"
              name="publishedAt"
              className="input input-sm input-bordered w-full"
              value={formData.publishedAt}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-sm flex items-center gap-1"><Users className="w-4 h-4" /> Authors</span>
              <span className="label-text-alt">Separate by commas or new lines</span>
            </label>
            <textarea
              name="authorsText"
              className="textarea textarea-bordered textarea-sm w-full h-24"
              placeholder="Author One\nAuthor Two"
              value={formData.authorsText}
              onChange={handleInputChange}
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary" disabled={isUploading}>{editingPaper ? 'Save Changes' : 'Add Paper'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
