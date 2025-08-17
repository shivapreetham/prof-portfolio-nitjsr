import React from 'react';

export const VideoList = ({ videosList, onEdit, onDelete }) => {
  if (!videosList || videosList.length === 0) {
    return <p className="text-center py-8 text-base-content/60">No videos found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Title</th>
            <th>Order</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videosList.map((video) => (
            <tr key={video._id}>
              <td className="w-32">
                {video.youtubeUrl ? (
                  <iframe
                    src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                    className="w-32 h-20"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video src={video.videoUrl} className="w-32 h-20" />
                )}
              </td>
              <td>{video.title || '-'}</td>
              <td>{video.order ?? '-'}</td>
              <td>{new Date(video.createdAt).toLocaleDateString()}</td>
              <td className="flex gap-2">
                <button className="btn btn-xs" onClick={() => onEdit(video)}>Edit</button>
                <button className="btn btn-xs btn-error" onClick={() => onDelete(video._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoList;

