
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface EntityActionsProps {
  id: string;
  nome: string;
  tipo: "meta" | "materia" | "conteudo";
  endpoint: string;
}

export default function EntityActions({
  id,
  nome,
  tipo,
  endpoint,
}: EntityActionsProps) {
  const router = useRouter();

  const [menuAberto, setMenuAberto] = useState(false);
  const [modal, setModal] = useState<"editar" | "excluir" | null>(null);
  const [novoNome, setNovoNome] = useState(nome);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const nomeTipo =
    tipo === "meta" ? "meta" : tipo === "materia" ? "matéria" : "conteúdo";

  async function editar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (carregando) return;

    setErro("");

    const nomeLimpo = novoNome.trim();

    if (!nomeLimpo) {
      setErro("Informe um nome válido.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nomeLimpo }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível editar.");
      }

      setModal(null);
      setErro("");
      router.refresh();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao editar.");
    } finally {
      setCarregando(false);
    }
  }

  async function excluir() {
    if (carregando) return;

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(endpoint, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível excluir.");
      }

      setModal(null);
      setMenuAberto(false);
      setErro("");

      router.refresh();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir.");
      setCarregando(false);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          disabled={carregando}
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-[#7775A8] transition hover:bg-[#F0EFF8] disabled:opacity-50"
          aria-label={`Opções da ${nomeTipo}`}
        >
          ⋯
        </button>

        {menuAberto && (
          <>
            <button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setMenuAberto(false)}
            />

            <div className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-2xl border border-[#C6C4E0]/40 bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setNovoNome(nome);
                  setErro("");
                  setMenuAberto(false);
                  setModal("editar");
                }}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#202B4A] transition hover:bg-[#F0EFF8]"
              >
                ✎ Editar
              </button>

              <button
                type="button"
                onClick={() => {
                  setErro("");
                  setMenuAberto(false);
                  setModal("excluir");
                }}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
              >
                ♧ Excluir
              </button>
            </div>
          </>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202B4A]/35 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !carregando) {
              setModal(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-[#C6C4E0]/40 bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#7775A8]">
                  MINDRA
                </p>

                <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                  {modal === "editar"
                    ? `Editar ${nomeTipo}`
                    : `Excluir ${nomeTipo}?`}
                </h2>
              </div>

              <button
                type="button"
                disabled={carregando}
                onClick={() => setModal(null)}
                className="rounded-full px-2 py-1 text-xl text-[#7775A8] hover:bg-[#F0EFF8]"
              >
                ×
              </button>
            </div>

            {modal === "editar" ? (
              <form onSubmit={editar}>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Nome
                </label>

                <input
                  autoFocus
                  value={novoNome}
                  onChange={(event) => setNovoNome(event.target.value)}
                  maxLength={100}
                  className="w-full rounded-xl border border-[#C6C4E0] bg-[#FDFCFC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
                />

                {erro && (
                  <p className="mt-3 text-sm text-red-500">{erro}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={carregando}
                    onClick={() => setModal(null)}
                    className="rounded-xl px-4 py-3 text-sm text-[#7775A8] hover:bg-[#F0EFF8]"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#303D60] disabled:opacity-50"
                  >
                    {carregando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-[#7775A8]">
                  Tem certeza de que deseja excluir{" "}
                  <strong className="text-[#202B4A]">{nome}</strong>?
                  {tipo === "meta"
                    ? " As matérias, conteúdos e flashcards vinculados também serão excluídos."
                    : tipo === "materia"
                      ? " Os conteúdos e flashcards dessa matéria também serão excluídos."
                      : " Os flashcards e avaliações desse conteúdo também serão excluídos."}
                  {" "}Essa ação não pode ser desfeita.
                </p>

                {erro && (
                  <p className="mt-3 text-sm text-red-500">{erro}</p>
                )}

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={carregando}
                    onClick={() => setModal(null)}
                    className="rounded-xl px-4 py-3 text-sm text-[#7775A8] hover:bg-[#F0EFF8]"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={carregando}
                    onClick={excluir}
                    className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {carregando ? "Excluindo..." : "Sim, excluir"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
