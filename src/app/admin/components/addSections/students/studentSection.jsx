import React from 'react';
import { PenSquare } from 'lucide-react';
import { AddStudent } from './addStudent';
import { StudentList } from './studentList';
import { useStudents } from './useStudents';
import { Toaster } from 'react-hot-toast';

export const StudentSection = () => {
  const {
    students,
    isLoading,
    error,
    editingStudent,
    isModalOpen,
    handleEdit,
    handleDelete,
    handleSaved,
    fetchStudents,
    openModal,
    closeModal
  } = useStudents();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <PenSquare className="w-6 h-6" />
          Students
        </h2>
        <button className="btn btn-primary" onClick={openModal}>
          New Student
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading students...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={fetchStudents} className="btn btn-link mt-2">Retry</button>
        </div>
      ) : (
        <StudentList students={students} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <AddStudent
          isOpen={isModalOpen}
          onClose={closeModal}
          editingStudent={editingStudent}
          onStudentSaved={handleSaved}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};
