"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Flashcard {
  id: string;
  front: string;
  backText: string | null;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
}

export default function FlashcardViewer({
  flashcards,
}: FlashcardViewerProps) {
  const router = useRouter();

  const [virado, setVirado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (indice >= flashcards.length) {
      setIndice(Math.max(0, flashcards.length - 1));
    }
  }, [flashcards.length, indice]);

  if (flashcards.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-[#7775A8]">
          Seus flashcards aparecerão aqui depois de cadastrados.
        </p>
      </div>
    );
  }

  const flashcardAtual = flashcards[indice];

  function proximoFlashcard() {
    setVirado(false);
    setIndice((atual) => (atual + 1) % flashcards.length);
  }

  function abrirEdicao() {
    setPergunta(flashcardAtual.front);
    setResposta(flashcardAtual.backText || "");
    setErro("");
    setModalAberto(true);
  }

  async function salvarEdicao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!pergunta.trim() || !resposta.trim()) {
      setErro("Preencha a pergunta e a resposta.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("/api/flashcard", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: flashcardAtual.id,
          front: pergunta.trim(),
          backText: resposta.trim(),
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(
          dados.erro || "Não foi possível editar o flashcard."
        );
      }

      setModalAberto(false);
      setVirado(false);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao editar flashcard."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function excluirFlashcard() {
    setCarregando(true);
    setErro("");

    try {
      const response = await fetch(
        `/api/flashcard?id=${flashcardAtual.id}`,
        { method: "DELETE" }
      );

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(
          dados.erro || "Não foi possível excluir o flashcard."
        );
      }

      setConfirmarExclusao(false);
      setVirado(false);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao excluir flashcard."
      );
      setConfirmarExclusao(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-6 text-xs text-[#AAA8B8]">
        CARTÃO {indice + 1} DE {flashcards.length}
      </p>

      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={abrirEdicao}
          className="rounded-xl border border-[#C6C4E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#7775A8] transition hover:bg-[#F0EFF8]"
        >
          ✎ Editar cartão
        </button>

        <button
          type="button"
          onClick={() => {
            setErro("");
            setConfirmarExclusao(true);
          }}
          disabled={carregando}
          className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          Excluir cartão
        </button>
      </div>

      {erro && !modalAberto && !confirmarExclusao && (
        <p className="mb-4 text-sm text-red-600">{erro}</p>
      )}

      <button
        type="button"
        onClick={() => setVirado(!virado)}
        className="group h-[420px] w-full max-w-[950px] [perspective:1200px]"
      >
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            virado ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Frente do cartão */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] border border-[#C6C4E0]/50 bg-white p-12 shadow-[0_12px_30px_rgba(32,43,74,0.07)] [backface-visibility:hidden]">
            <span className="absolute left-9 top-9 text-xs font-semibold tracking-[0.2em] text-[#AAA8B8]">
              PERGUNTA
            </span>

            <span className="mb-6 text-3xl text-[#C6C4E0]">✦</span>

            <p className="max-w-[700px] text-center font-[var(--font-cormorant)] text-3xl font-semibold leading-relaxed text-[#202B4A]">
              {flashcardAtual.front}
            </p>

            <span className="absolute bottom-9 text-xs text-[#AAA8B8]">
              Clique para revelar a resposta
            </span>
          </div>

          {/* Verso do cartão */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[32px] border border-[#C6C4E0]/50 bg-[#F0EFF8] p-12 shadow-[0_12px_30px_rgba(32,43,74,0.07)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="absolute left-9 top-9 text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
              RESPOSTA
            </span>

            <p className="max-w-[700px] text-center text-lg leading-relaxed text-[#202B4A]">
              {flashcardAtual.backText || "Nenhuma resposta cadastrada."}
            </p>

            <span className="absolute bottom-9 text-xs text-[#8B89A8]">
              Clique para voltar à pergunta
            </span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={proximoFlashcard}
        className="mt-7 rounded-xl bg-[#202B4A] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7775A8]"
      >
        Próximo cartão →
      </button>

      {/* Modal de edição */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202B4A]/35 px-4 backdrop-blur-md"
          onClick={() => !carregando && setModalAberto(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-[#C6C4E0]/40 bg-[#F5F0ED] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#7775A8]">
                  EDITAR FLASHCARD
                </p>

                <h2 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
                  Ajuste seu cartão.
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={carregando}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-[#7775A8]"
              >
                ×
              </button>
            </div>

            <form onSubmit={salvarEdicao} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Pergunta
                </label>

                <textarea
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#C6C4E0]/60 bg-white px-4 py-3 text-sm text-[#202B4A] outline-none focus:border-[#7775A8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Resposta
                </label>

                <textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#C6C4E0]/60 bg-white px-4 py-3 text-sm text-[#202B4A] outline-none focus:border-[#7775A8]"
                />
              </div>

              {erro && (
                <p className="text-sm text-red-600">{erro}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  disabled={carregando}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-[#7775A8] hover:bg-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={carregando}
                  className="rounded-xl bg-[#7775A8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#202B4A] disabled:opacity-50"
                >
                  {carregando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmarExclusao && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#202B4A]/35 px-4 backdrop-blur-md"
          onClick={() => !carregando && setConfirmarExclusao(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#C6C4E0]/40 bg-[#F5F0ED] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h2 className="mt-5 text-center font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
              Excluir este flashcard?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-[#7775A8]">
              Essa ação não poderá ser desfeita. O cartão será removido
              permanentemente do seu conteúdo.
            </p>

            {erro && (
              <p className="mt-4 text-center text-sm text-red-600">
                {erro}
              </p>
            )}

            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                disabled={carregando}
                onClick={() => setConfirmarExclusao(false)}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[#7775A8] transition hover:bg-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={carregando}
                onClick={excluirFlashcard}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {carregando ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}