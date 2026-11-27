"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CreateTopicModalProps {
  deckId: string;
}

export default function CreateTopicModal({
  deckId,
}: CreateTopicModalProps) {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function criarConteudo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(`/api/decks/${deckId}/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nome }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErro(dados.erro || "Não foi possível criar o conteúdo.");
        return;
      }

      setNome("");
      setAberto(false);
      router.refresh();
    } catch {
      setErro("Erro ao criar conteúdo. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="flex items-center gap-2 rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7775A8]"
      >
        <span className="text-xl">+</span>
        Adicionar conteúdo
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B4A]/40 p-4 backdrop-blur-md"
          onClick={() => setAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="topic-modal-title"
            className="w-full max-w-md rounded-3xl border border-[#C6C4E0]/30 bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
                  NOVO CONTEÚDO
                </p>

                <h2
                  id="topic-modal-title"
                  className="mt-2 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]"
                >
                  O que você vai estudar?
                </h2>

                <p className="mt-2 text-sm text-[#7775A8]">
                  Crie um conteúdo para organizar seus flashcards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar janela"
                className="ml-3 rounded-full px-3 py-1 text-2xl text-[#7775A8] transition hover:bg-[#F5F0ED]"
              >
                ×
              </button>
            </div>

            <form onSubmit={criarConteudo}>
              <label className="mb-2 block text-sm font-semibold text-[#202B4A]">
                Nome do conteúdo
              </label>

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Direitos fundamentais"
                maxLength={100}
                required
                autoFocus
                className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FAF9FC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
              />

              {erro && (
                <p className="mt-3 text-sm text-red-600">{erro}</p>
              )}

              <button
                type="submit"
                disabled={carregando || !nome.trim()}
                className="mt-5 w-full rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7775A8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {carregando ? "Criando..." : "Criar conteúdo"}
              </button>
            </form>

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