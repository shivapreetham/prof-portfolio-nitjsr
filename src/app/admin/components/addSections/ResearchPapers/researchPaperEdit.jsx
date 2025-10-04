'use client';

import React from 'react';
import { FileEdit, Trash2, FileText, Calendar, Layers, MapPin, Link2, Users } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const ResearchPaperListEdit = ({ papersList, onEdit, onDelete }) => {
  if (!papersList?.length) {
    return <p className="text-gray-500 italic">No research papers found</p>;
  }

  return (
    <div className="space-y-4">
      {papersList.map((paper) => (
        <div key={paper._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="card-title flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {paper.title}
                  </h4>
                  <span className="badge badge-sm badge-outline flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {paper.category}
                  </span>
                </div>

                {paper.description && (
                  <p className="text-base-content/70 whitespace-pre-wrap text-sm">{paper.description}</p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-base-content/60">
                  {paper.journalOrConference && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {paper.journalOrConference}
                    </span>
                  )}
                  {paper.volume && <span>Vol: {paper.volume}</span>}
                  {paper.pages && <span>Pages: {paper.pages}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(paper.publishedAt)}
                  </span>
                </div>

                {Array.isArray(paper.authors) && paper.authors.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-base-content/70">
                    <span className="inline-flex items-center gap-1 uppercase tracking-wide text-[10px] text-base-content/50">
                      <Users className="w-3 h-3" /> Authors
                    </span>
                    {paper.authors.map((author, idx) => (
                      <span key={`${paper._id || paper.title}-author-${idx}`} className="badge badge-xs badge-outline">
                        {author}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 text-xs">
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="w-3 h-3" /> PDF
                    </a>
                  )}
                  {paper.externalLink && (
                    <a
                      href={paper.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Link2 className="w-3 h-3" /> External Link
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-sm btn-ghost"
                  onClick={() => onEdit(paper)}
                >
                  <FileEdit className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(paper._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResearchPaperListEdit;
