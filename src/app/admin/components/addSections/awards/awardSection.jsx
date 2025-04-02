'use client';
import React from 'react';
import { AwardListEdit } from './awardListEdit';
import { AddAward } from './addAward';
import { useAwards } from './useAwards';
import { Toaster } from 'react-hot-toast';
import { Trophy } from 'lucide-react';

export const AwardSection = () => {
  const {
    awardsList,
    isLoading,
    error,
    editingAward,
    isAddModalOpen,
    handleEditAward,
    handleDeleteAward,
    handleAwardAdded,
    getAwardsList,
    openAddModal,
    closeAddModal
  } = useAwards();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Awards
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Award
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading awards...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getAwardsList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <AwardListEdit
          awardsList={awardsList}
          onEdit={handleEditAward}
          onDelete={handleDeleteAward}
        />
      )}

      {isAddModalOpen && (
        <AddAward
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingAward={editingAward}
          onAwardAdded={handleAwardAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};

export default AwardSection;
