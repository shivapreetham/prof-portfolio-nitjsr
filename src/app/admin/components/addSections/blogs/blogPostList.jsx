import { Clock, FileEdit, Image, PenSquare, Trash2, Video, FileImage } from "lucide-react";
import React from "react";

export const BlogPostList = ({ postsList, onEdit, onDelete }) => {
  if (!postsList?.length) {
    return <p className="text-gray-500 italic">No blog posts found</p>;
  }

  return (
    <div className="space-y-4">
      {postsList.map((post) => (
        <div key={post._id} className="card bg-base-500 shadow-xl">
          <div className="card-body bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="card-title flex items-center gap-2">
                  <PenSquare className="w-5 h-5" />
                  {post.title}
                </h4>
                <p className="text-base-content/70 mt-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-base-content/60">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.imageUrl && (
                    <div className="flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      <span>Featured image</span>
                    </div>
                  )}
                  {post.mediaFiles && post.mediaFiles.length > 0 && (
                    <div className="flex items-center">
                      <FileImage className="w-4 h-4 mr-1" />
                      <span>{post.mediaFiles.length} media file{post.mediaFiles.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-sm btn-ghost"
                  onClick={() => onEdit(post)}
                >
                  <FileEdit className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-square btn-sm btn-ghost text-error"
                  onClick={() => onDelete(post._id)}
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
