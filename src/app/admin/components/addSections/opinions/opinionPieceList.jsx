import { Clock, FileEdit, Image, PenSquare, Trash2, Video, FileImage } from "lucide-react";
import React from "react";

export const OpinionPieceList = ({ opinionsList, onEdit, onDelete }) => {
  if (!opinionsList?.length) {
    return <p className="text-gray-500 italic">No opinion pieces found</p>;
  }

  return (
    <div className="space-y-4">
      {opinionsList.map((opinion) => (
        <div key={opinion._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title flex items-center gap-2">
                  <PenSquare className="w-5 h-5" />
                  {opinion.title}
                </h4>
                <p className="text-base-content/70 mt-2 line-clamp-2">
                  {opinion.content}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-base-content/60">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(opinion.createdAt).toLocaleDateString()}</span>
                  </div>
                  {opinion.imageUrl && (
                    <div className="flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      <span>Featured image</span>
                    </div>
                  )}
                  {opinion.mediaFiles && opinion.mediaFiles.length > 0 && (
                    <div className="flex items-center">
                      <FileImage className="w-4 h-4 mr-1" />
                      <span>{opinion.mediaFiles.length} media file{opinion.mediaFiles.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-sm btn-ghost"
                  onClick={() => onEdit(opinion)}
                >
                  <FileEdit className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(opinion._id)}
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
