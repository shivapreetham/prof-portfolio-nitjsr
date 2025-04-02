'use client';
import React from 'react';
import { FileEdit, Trash2 } from 'lucide-react';

export const CollaborationListEdit = ({ collaborationsList, onEdit, onDelete }) => {
  if (!collaborationsList?.length) {
    return <p className="text-gray-500 italic">No collaborations found</p>;
  }
  return (
    <div className="space-y-4">
      {collaborationsList.map(collab => (
        <div key={collab._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title">{collab.projectTitle}</h4>
                <p className="text-base-content/70 mt-1">
                  Collaborator: {collab.collaboratorName}
                </p>
                {collab.institution && <p className="text-base-content/70 mt-1">Institution: {collab.institution}</p>}
                <div className="mt-2 text-sm text-base-content/60">
                  <span className="mr-4">Start: {new Date(collab.startDate).toLocaleDateString()}</span>
                  {collab.endDate && <span>End: {new Date(collab.endDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-square btn-sm btn-ghost" onClick={() => onEdit(collab)}>
                  <FileEdit className="h-4 w-4" />
                </button>
                <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => onDelete(collab._id)}>
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
