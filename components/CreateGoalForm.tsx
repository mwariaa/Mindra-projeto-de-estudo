
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CreateGoalFormProps {
  onSuccess: () => void;
}

export default function CreateGoalForm({
  onSuccess,
}: CreateGoalFormProps) {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function criarMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErro(dados.erro || "Não foi possível criar a meta.");
        return;
      }

      setNome("");
      router.refresh();
      onSuccess();
    } catch {
      setErro("Erro ao criar meta. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={criarMeta}>
      <label className="mb-2 block text-sm font-semibold text-[#202B4A]">
        Nome da meta
      </label>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Ex.: Concurso TRE"
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
        {carregando ? "Criando..." : "Criar meta"}
      </button>
    </form>
  );
}
