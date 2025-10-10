import React from 'react';
import { Briefcase } from 'lucide-react';
import { AddFundedProject } from './addFundedProject';
import { FundedProjectList } from './fundedProjectList';
import { useFundedProjects } from './useFundedProjects';
import { Toaster } from 'react-hot-toast';

export const FundedProjectSection = () => {
  const {
    projects,
    isLoading,
    error,
    editingProject,
    isModalOpen,
    handleEdit,
    handleDelete,
    handleSaved,
    fetchProjects,
    openModal,
    closeModal
  } = useFundedProjects();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Funded Projects
        </h2>
        <button className="btn btn-primary" onClick={openModal}>
          New Funded Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading funded projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={fetchProjects} className="btn btn-link mt-2">Retry</button>
        </div>
      ) : (
        <FundedProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <AddFundedProject
          isOpen={isModalOpen}
          onClose={closeModal}
          editingProject={editingProject}
          onProjectAdded={handleSaved}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};
