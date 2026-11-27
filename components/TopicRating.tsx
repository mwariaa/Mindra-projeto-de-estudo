"use client";

import { useEffect, useState } from "react";

interface TopicRatingProps {
  topicId: string;
}

type Rating = "APROFUNDAR" | "REVISAR" | "DOMINANDO";

const opcoes: {
  valor: Rating;
  titulo: string;
  descricao: string;
}[] = [
  {
    valor: "APROFUNDAR",
    titulo: "Aprofundar",
    descricao: "Ainda preciso estudar mais este conteúdo.",
  },
  {
    valor: "REVISAR",
    titulo: "Revisar",
    descricao: "Já compreendi, mas preciso reforçar.",
  },
  {
    valor: "DOMINANDO",
    titulo: "Dominando",
    descricao: "Tenho segurança sobre este conteúdo.",
  },
];

export default function TopicRating({ topicId }: TopicRatingProps) {
  const [aberto, setAberto] = useState(false);
  const [classificacao, setClassificacao] = useState<Rating | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarClassificacao() {
      try {
        const resposta = await fetch(`/api/topics/${topicId}/reviews`);
        const dados = await resposta.json();

        if (resposta.ok && dados.classificacaoAtual) {
          setClassificacao(dados.classificacaoAtual);
        }
      } catch {
        setErro("Não foi possível carregar sua classificação.");
      }
    }

    carregarClassificacao();
  }, [topicId]);

  async function classificar(rating: Rating) {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`/api/topics/${topicId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível registrar sua avaliação."
        );
      }

      setClassificacao(rating);
      setAberto(false);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao registrar sua avaliação."
      );
    } finally {
      setCarregando(false);
    }
  }

  const classificacaoAtual = opcoes.find(
    (opcao) => opcao.valor === classificacao
  );

  return (
    <>
      <div className="flex w-[190px] flex-col items-center">
        <button
          type="button"
          onClick={() => {
            setErro("");
            setAberto(true);
          }}
          className="flex h-12 w-[190px] items-center justify-center whitespace-nowrap rounded-xl border border-[#C6C4E0]/60 bg-white px-4 text-sm font-semibold text-[#202B4A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7775A8] hover:text-[#7775A8]"
        >
          {classificacaoAtual ? "Alterar avaliação" : "Avaliar conteúdo"}
        </button>

        {classificacaoAtual && (
          <p className="mt-2 text-center text-xs text-[#7775A8]">
            Classificação atual:{" "}
            <strong>{classificacaoAtual.titulo}</strong>
          </p>
        )}
      </div>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202B4A]/35 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !carregando) {
              setAberto(false);
            }
          }}
        >
          <div className="relative my-auto w-full max-w-xl rounded-3xl border border-[#C6C4E0]/50 bg-[#FDFCFF] p-7 shadow-2xl shadow-[#202B4A]/20">
            <button
              type="button"
              onClick={() => setAberto(false)}
              disabled={carregando}
              aria-label="Fechar"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#7775A8] transition hover:bg-[#F0EFF8] disabled:opacity-40"
            >
              ×
            </button>

            <div className="mb-8 pr-8 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
                SUA EVOLUÇÃO
              </p>

              <h2 className="mt-3 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Como está seu domínio?
              </h2>

              <p className="mt-2 text-sm text-[#7775A8]">
                Escolha a classificação que melhor representa seu aprendizado.
              </p>
            </div>

            <div className="grid gap-3">
              {opcoes.map((opcao) => {
                const selecionada = classificacao === opcao.valor;

                return (
                  <button
                    key={opcao.valor}
                    type="button"
                    disabled={carregando}
                    onClick={() => classificar(opcao.valor)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:border-[#7775A8] hover:bg-[#F8F7FC] disabled:cursor-wait disabled:opacity-60 ${
                      selecionada
                        ? "border-[#7775A8] bg-[#F0EFF8]"
                        : "border-[#C6C4E0]/50 bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                        selecionada
                          ? "bg-[#7775A8] text-white"
                          : "bg-[#F0EFF8] text-[#7775A8]"
                      }`}
                    >
                      {selecionada ? "✓" : "✦"}
                    </span>

                    <span className="flex-1">
                      <span className="block font-semibold text-[#202B4A]">
                        {opcao.titulo}
                      </span>

                      <span className="mt-1 block text-xs leading-relaxed text-[#7775A8]">
                        {opcao.descricao}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {carregando && (
              <p className="mt-5 text-center text-sm text-[#7775A8]">
                Registrando sua avaliação...
              </p>
            )}

            {erro && (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                {erro}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}