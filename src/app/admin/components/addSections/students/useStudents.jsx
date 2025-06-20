'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Could not load students');
      toast.error('Could not load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleEdit = student => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted successfully');
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const handleSaved = () => {
    fetchStudents();
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  return {
    students,
    isLoading,
    error,
    editingStudent,
    isModalOpen,
    fetchStudents,
    handleEdit,
    handleDelete,
    handleSaved,
    openModal: () => { setEditingStudent(null); setIsModalOpen(true); },
    closeModal: () => { setEditingStudent(null); setIsModalOpen(false); }
  };
};