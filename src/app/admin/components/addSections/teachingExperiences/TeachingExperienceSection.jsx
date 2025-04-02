'use client';
import React from 'react';
import { TeachingExperienceListEdit } from './TeachingExperienceListEdit';
import { AddTeachingExperience } from './AddTeachingExperience';
import { useTeachingExperiences } from './useTeachingExperiences';
import { Toaster } from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

export const TeachingExperienceSection = () => {
  const {
    experiencesList,
    isLoading,
    error,
    editingExperience,
    isAddModalOpen,
    handleEditExperience,
    handleDeleteExperience,
    handleExperienceAdded,
    getExperiencesList,
    openAddModal,
    closeAddModal
  } = useTeachingExperiences();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Teaching Experiences
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Experience
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading experiences...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getExperiencesList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <TeachingExperienceListEdit
          experiencesList={experiencesList}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
        />
      )}

      {isAddModalOpen && (
        <AddTeachingExperience
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingExperience={editingExperience}
          onExperienceAdded={handleExperienceAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};

export default TeachingExperienceSection;
