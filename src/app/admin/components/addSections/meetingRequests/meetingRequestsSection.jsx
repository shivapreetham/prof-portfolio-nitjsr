import { CalendarCheck } from "lucide-react";
import React from "react";
import { useMeetingRequests } from "./useMeetingRequests";
import { MeetingRequestsList } from "./meetingRequestsList";
import { Toaster } from "react-hot-toast";

export const MeetingRequestsSection = () => {
  const {
    requestsList,
    isLoading,
    error,
    handleUpdateStatus,
    handleDeleteRequest,
    getRequestsList,
  } = useMeetingRequests();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          Meeting Requests
        </h2>
        <button onClick={getRequestsList} className="btn btn-sm btn-ghost">
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading meeting requests...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getRequestsList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <MeetingRequestsList
          requestsList={requestsList}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteRequest}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};
