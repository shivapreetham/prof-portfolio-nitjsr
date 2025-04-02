'use client';
import React from 'react';
import { FileEdit, Trash2 } from 'lucide-react';

export const TeachingExperienceListEdit = ({ experiencesList, onEdit, onDelete }) => {
  if (!experiencesList?.length) {
    return <p className="text-gray-500 italic">No teaching experiences found</p>;
  }
  return (
    <div className="space-y-4">
      {experiencesList.map(exp => (
        <div key={exp._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title">{exp.subject}</h4>
                <p className="text-base-content/70 mt-1">{exp.institution}</p>
                <div className="mt-2 text-sm text-base-content/60">
                  <span className="mr-4">Start: {new Date(exp.startDate).toLocaleDateString()}</span>
                  {exp.endDate && <span>End: {new Date(exp.endDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-square btn-sm btn-ghost" onClick={() => onEdit(exp)}>
                  <FileEdit className="h-4 w-4" />
                </button>
                <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => onDelete(exp._id)}>
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
