import { MessageSquare } from "lucide-react";
import React from "react";
import { useOpinionPieces } from "./useOpinionPieces";
import { AddOpinionPiece } from "./addOpinionPiece";
import { OpinionPieceList } from "./opinionPieceList";
import { Toaster } from "react-hot-toast";

export const OpinionSection = () => {
  const {
    opinionsList,
    isLoading,
    error,
    editingOpinion,
    isAddModalOpen,
    handleEditOpinion,
    handleDeleteOpinion,
    handleOpinionAdded,
    getOpinionsList,
    openAddModal,
    closeAddModal
  } = useOpinionPieces();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Opinion Pieces
        </h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          New Opinion Piece
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2 text-base-content/60">Loading opinion pieces...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error">{error}</p>
          <button onClick={getOpinionsList} className="btn btn-link mt-2">
            Try again
          </button>
        </div>
      ) : (
        <OpinionPieceList
          opinionsList={opinionsList}
          onEdit={handleEditOpinion}
          onDelete={handleDeleteOpinion}
        />
      )}

      {isAddModalOpen && (
        <AddOpinionPiece
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          editingOpinion={editingOpinion}
          onOpinionAdded={handleOpinionAdded}
        />
      )}

      <Toaster position="bottom-right" />
    </section>
  );
};
