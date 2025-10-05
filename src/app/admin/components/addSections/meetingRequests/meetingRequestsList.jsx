import { Calendar, User, Mail, MessageSquare, Check, X, Trash2, Clock } from "lucide-react";
import React from "react";

export const MeetingRequestsList = ({ requestsList, onUpdateStatus, onDelete }) => {
  if (!requestsList?.length) {
    return <p className="text-gray-500 italic">No meeting requests found</p>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {requestsList.map((request) => (
        <div key={request._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="card-title text-lg">
                    {request.name}
                  </h4>
                  <span className={`badge badge-sm ${getStatusColor(request.status)} text-white capitalize`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-base-content/70">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Preferred: {new Date(request.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{request.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-base-300 rounded-lg">
                  <p className="text-sm text-base-content/80">
                    <span className="font-semibold">Message: </span>
                    {request.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {request.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-square btn-sm btn-success"
                      onClick={() => onUpdateStatus(request._id, 'approved')}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-square btn-sm btn-error"
                      onClick={() => onUpdateStatus(request._id, 'rejected')}
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(request._id)}
                  title="Delete"
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
