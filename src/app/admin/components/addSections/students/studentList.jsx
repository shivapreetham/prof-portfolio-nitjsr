import React from 'react';
import { Clock, FileEdit, Trash2, Image as ImageIcon } from 'lucide-react';

export const StudentList = ({ students, onEdit, onDelete }) => {
  if (!students?.length) return <p className="italic text-gray-500">No students found</p>;

  return (
    <div className="space-y-4">
      {students.map(student => (
        <div key={student._id} className="card bg-base-500 shadow-lg">
          <div className="card-body p-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <h4 className="flex items-center gap-2 card-title">
                  {student.name}
                </h4>
                <p className="text-sm text-base-content/70 mt-1">
                  {student.course} - {student.branch}
                </p>
                <p className="mt-2 line-clamp-2">{student.projectTitle}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-base-content/60">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(student.startDate).toLocaleDateString()} - {new Date(student.endDate).toLocaleDateString()}</span>
                  </div>
                  {student.imageUrl && (
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      <span>Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-ghost btn-square" onClick={() => onEdit(student)}>
                  <FileEdit className="w-4 h-4" />
                </button>
                <button className="btn btn-sm btn-ghost btn-square text-error" onClick={() => onDelete(student._id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
