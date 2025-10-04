import React from 'react';
import { Clock, FileEdit, Trash2, Image as ImageIcon } from 'lucide-react';

export const StudentList = ({ students, onEdit, onDelete }) => {
  if (!students?.length) return <p className="italic text-gray-500">No students found</p>;

  return (
    <div className="space-y-4">
      {students.map(student => {
        const name = student.name_of_student || student.name || 'Unnamed Student';
        const topic = student.research_topic || student.projectTitle || 'Research topic not provided';
        const completionYear = student.completion_year || student.endDate?.split?.('T')?.[0] || 'N/A';
        const heading = student.heading ?? student.id ?? 'N/A';
        const facultyId = student.faculty_id || student.branch || 'N/A';
        const legacyImage = student.imageUrl;
        const imageUrl = student.image_url || legacyImage;
        const studentType = student.student_type || 'N/A';
        const typeLabels = {
          masters: 'Masters',
          phd: 'PhD',
          bachelor: 'Bachelor'
        };
        const studentTypeLabel = typeof studentType === 'string'
          ? (typeLabels[studentType] || studentType)
          : 'N/A';

        return (
          <div key={student._id} className="card bg-base-500 shadow-lg">
            <div className="card-body p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h4 className="flex items-center gap-2 card-title">
                    {name}
                  </h4>
                  <p className="text-sm text-base-content/70 mt-1">
                    Research Topic: {topic}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-base-content/60">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Completion Year: {completionYear}</span>
                    </div>
                    <span>ID: {student.id ?? 'N/A'}</span>
                    <span>Heading: {heading}</span>
                    <span>Faculty ID: {facultyId}</span>
                    <span>Type: {studentTypeLabel}</span>
                    {imageUrl && (
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
                  <button className="btn btn-sm btn-ghost btn-square text-error" onClick={() => onDelete(student)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
