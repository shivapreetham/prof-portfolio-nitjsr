'use client';
import React from 'react';
import { FileEdit, Trash2, Calendar } from 'lucide-react';

export const AwardListEdit = ({ awardsList, onEdit, onDelete }) => {
  if (!awardsList?.length) {
    return <p className="text-gray-500 italic">No awards found</p>;
  }
  return (
    <div className="space-y-4">
      {awardsList.map(award => (
        <div key={award._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title">{award.title}</h4>
                <p className="text-base-content/70 mt-1">{award.organization}</p>
                <div className="mt-2 text-sm text-base-content/60">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(award.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-square btn-sm btn-ghost" onClick={() => onEdit(award)}>
                  <FileEdit className="h-4 w-4" />
                </button>
                <button className="btn btn-square btn-sm btn-ghost text-error" onClick={() => onDelete(award._id)}>
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
