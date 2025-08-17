import React from 'react';

export const PhotoList = ({ photosList, onEdit, onDelete }) => {
  if (!photosList || photosList.length === 0) {
    return <p className="text-center py-8 text-base-content/60">No photos found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Caption</th>
            <th>Order</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {photosList.map((photo) => (
            <tr key={photo._id}>
              <td>
                <img src={photo.imageUrl} alt={photo.title || 'Photo'} className="w-16 h-16 object-cover rounded" />
              </td>
              <td>{photo.title || '-'}</td>
              <td className="max-w-xs truncate">{photo.caption || '-'}</td>
              <td>{photo.order ?? '-'}</td>
              <td>{new Date(photo.createdAt).toLocaleDateString()}</td>
              <td className="flex gap-2">
                <button className="btn btn-xs" onClick={() => onEdit(photo)}>Edit</button>
                <button className="btn btn-xs btn-error" onClick={() => onDelete(photo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhotoList;

