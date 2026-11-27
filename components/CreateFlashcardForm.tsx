"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CreateFlashcardFormProps {
  topicId: string;
}

export default function CreateFlashcardForm({
  topicId,
}: CreateFlashcardFormProps) {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function criarFlashcard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!pergunta.trim() || !resposta.trim()) {
      setErro("Preencha a pergunta e a resposta.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch("/api/flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          front: pergunta,
          backText: resposta,
        }),
      });

      const texto = await response.text();

      let data;

      try {
        data = JSON.parse(texto);
      } catch {
        throw new Error(
          `O servidor retornou uma resposta inesperada (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.erro || data.message || `Erro HTTP ${response.status}`
        );
      }

      setPergunta("");
      setResposta("");
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar flashcard:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o flashcard."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[560px]">
      <form
        onSubmit={criarFlashcard}
        className="rounded-2xl border border-[#C6C4E0]/40 bg-white p-5 shadow-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#202B4A]">
              Pergunta
            </label>
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Digite a pergunta..."
              rows={2}
              className="w-full resize-none rounded-xl border border-[#C6C4E0]/50 bg-[#FDFCFF] px-4 py-3 text-sm text-[#202B4A] outline-none placeholder:text-[#AAA8B8] focus:border-[#7775A8]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#202B4A]">
              Resposta
            </label>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite a resposta..."
              rows={2}
              className="w-full resize-none rounded-xl border border-[#C6C4E0]/50 bg-[#FDFCFF] px-4 py-3 text-sm text-[#202B4A] outline-none placeholder:text-[#AAA8B8] focus:border-[#7775A8]"
            />
          </div>
        </div>

        {erro && (
          <p className="mt-3 text-sm text-red-500">{erro}</p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="mt-4 w-full rounded-xl bg-[#202B4A] py-3 text-sm font-semibold text-white transition hover:bg-[#7775A8] disabled:opacity-50"
        >
          {carregando ? "Salvando..." : "Adicionar flashcard"}
        </button>
      </form>
    </section>
  );
}