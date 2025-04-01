'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BlogPost } from '@/models/models';

export const useBlogPosts = () => {
  const [postsList, setPostsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getPostsList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch blog posts sorted by createdAt descending using Mongoose
      const postsListData = await BlogPost.find().sort({ createdAt: -1 });
      setPostsList(postsListData);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to fetch blog posts');
      toast.error('Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostsList();
  }, []);

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsAddModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      await BlogPost.findByIdAndDelete(postId);
      toast.success('Post deleted successfully!');
      getPostsList();
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete post');
    }
  };

  const handlePostAdded = () => {
    getPostsList();
    setEditingPost(null);
    setIsAddModalOpen(false);
    toast.success('Post saved successfully!');
  };

  const openAddModal = () => {
    setEditingPost(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingPost(null);
  };

  return {
    postsList,
    isLoading,
    error,
    editingPost,
    isAddModalOpen,
    handleEditPost,
    handleDeletePost,
    handlePostAdded,
    getPostsList,
    openAddModal,
    closeAddModal,
  };
};

export default useBlogPosts;
