
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateIndependentDeckModal() {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function criarMateria(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nome.trim()) {
      setErro("Digite o nome da matéria.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("/api/decks/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nome.trim(),
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.erro || dados.message || "Não foi possível criar a matéria.");
      }

      setNome("");
      setAberto(false);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao criar matéria."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="rounded-xl bg-[#7775A8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202B4A]"
      >
        + Nova matéria
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202B4A]/35 px-4 backdrop-blur-md"
          onClick={() => setAberto(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#C6C4E0]/40 bg-[#F5F0ED] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#7775A8]">
                  NOVA MATÉRIA
                </p>

                <h2 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
                  Vamos começar?
                </h2>
              </div>

              <button
                onClick={() => setAberto(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-[#7775A8] hover:bg-[#F0EFF8]"
              >
                ×
              </button>
            </div>

            <form onSubmit={criarMateria} className="mt-7">
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                Nome da matéria
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Direito Constitucional"
                maxLength={100}
                className="w-full rounded-xl border border-[#C6C4E0]/60 bg-white px-4 py-3 text-sm text-[#202B4A] outline-none transition placeholder:text-[#AAA8B8] focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
              />

              {erro && (
                <p className="mt-3 text-sm text-red-600">{erro}</p>
              )}

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-[#7775A8] hover:bg-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={carregando}
                  className="rounded-xl bg-[#7775A8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#202B4A] disabled:opacity-50"
                >
                  {carregando ? "Criando..." : "Criar matéria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
