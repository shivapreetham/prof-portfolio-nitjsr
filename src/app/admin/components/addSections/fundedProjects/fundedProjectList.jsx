import React from 'react';
import { Clock, FileEdit, Trash2, DollarSign, Users } from 'lucide-react';

export const FundedProjectList = ({ projects, onEdit, onDelete }) => {
  if (!projects?.length) return <p className="italic text-gray-500">No funded projects found</p>;

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project._id} className="card bg-base-300 shadow-lg">
          <div className="card-body p-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <h4 className="card-title text-base flex items-center gap-2">
                  {project.title}
                  <span className="badge badge-sm badge-primary">{project.projectType}</span>
                  <span className={`badge badge-sm ${
                    project.status === 'Ongoing' ? 'badge-success' :
                    project.status === 'Completed' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {project.status}
                  </span>
                </h4>
                <p className="text-sm text-base-content/70 mt-2">
                  <strong>Funding Agency:</strong> {project.fundingAgency}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-base-content/60">
                  {project.role && (
                    <span><strong>Role:</strong> {project.role}</span>
                  )}
                  {project.amount && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{project.amount}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                  {project.collaborators && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="truncate max-w-xs">{project.collaborators}</span>
                    </div>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-base-content/70 mt-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-ghost btn-square" onClick={() => onEdit(project)}>
                  <FileEdit className="w-4 h-4" />
                </button>
                <button className="btn btn-sm btn-ghost btn-square text-error" onClick={() => onDelete(project)}>
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
