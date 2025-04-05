'use client';
import React from 'react';
import { CollaborationListEdit } from './collaborationListEdit';
import { AddCollaboration } from './addCollaboration';
import { useCollaborations } from './useCollaborations';
import { Toaster } from 'react-hot-toast';
import { Users } from 'lucide-react';

export const CollaborationSection = () => {
  const {
    collaborationsList,
    isLoading,
    error,
    editingCollaboration,
    isAddModalOpen,
    handleEditCollaboration,
    handleDeleteCollaboration,
    handleCollaborationAdded,
    getCollaborationsList,
    openAddModal,
    closeAddModal
  } = useCollaborations();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Collaborations
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Collaboration
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading collaborations...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getCollaborationsList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <CollaborationListEdit
          collaborationsList={collaborationsList}
          onEdit={handleEditCollaboration}
          onDelete={handleDeleteCollaboration}
        />
      )}

      {isAddModalOpen && (
        <AddCollaboration
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingCollaboration={editingCollaboration}
          onCollaborationAdded={handleCollaborationAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};

export default CollaborationSection;
