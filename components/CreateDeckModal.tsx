"use client";

import { useState } from "react";
import CreateDeckForm from "@/components/CreateDeckForm";

interface CreateDeckModalProps {
  studyGoalId: string;
}

export default function CreateDeckModal({
  studyGoalId,
}: CreateDeckModalProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-2 rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7775A8]"
      >
        <span className="text-xl">+</span>
        Adicionar matéria
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B4A]/40 p-4 backdrop-blur-md"
          onClick={() => setAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-materia-titulo"
            className="w-full max-w-md rounded-3xl border border-[#C6C4E0]/30 bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
                  NOVA MATÉRIA
                </p>

                <h2
                  id="modal-materia-titulo"
                  className="mt-2 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]"
                >
                  O que você vai estudar?
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
                  Organize sua meta adicionando uma matéria.
                </p>
              </div>

              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar janela"
                className="ml-3 rounded-full px-3 py-1 text-2xl text-[#7775A8] transition hover:bg-[#F5F0ED]"
              >
                ×
              </button>
            </div>

            <CreateDeckForm
              studyGoalId={studyGoalId}
              onSuccess={() => setAberto(false)}
            />

            <button
              type="button"
              onClick={() => setAberto(false)}
              className="mt-3 w-full rounded-xl py-2 text-sm font-medium text-[#7775A8] transition hover:bg-[#F5F0ED]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}