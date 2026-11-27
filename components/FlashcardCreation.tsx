"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateFlashcardForm from "@/components/CreateFlashcardForm";

interface FlashcardGerado {
  pergunta: string;
  resposta: string;
}

interface FlashcardCreationProps {
  topicId: string;
}

export default function FlashcardCreation({
  topicId,
}: FlashcardCreationProps) {
  const router = useRouter();

  const [aberto, setAberto] = useState(false);
  const [opcao, setOpcao] = useState<"menu" | "manual" | "ia">("menu");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardGerado[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function fechar() {
    setAberto(false);
    setOpcao("menu");
    setArquivo(null);
    setFlashcards([]);
    setErro("");
    setSucesso(false);
  }

  async function gerarFlashcards() {
    if (!arquivo) {
      setErro("Selecione um arquivo PDF primeiro.");
      return;
    }

    setCarregando(true);
    setErro("");
    setFlashcards([]);
    setSucesso(false);

    try {
      const formulario = new FormData();
      formulario.append("arquivo", arquivo);

      const resposta = await fetch("/api/ia", {
        method: "POST",
        body: formulario,
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Não foi possível gerar os flashcards."
        );
      }

      if (!Array.isArray(dados.flashcards) || dados.flashcards.length === 0) {
        throw new Error("A IA não encontrou flashcards para gerar.");
      }

      setFlashcards(dados.flashcards);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao processar o PDF."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function salvarFlashcards() {
    setSalvando(true);
    setErro("");

    let salvos = 0;

    try {
      for (const flashcard of flashcards) {
        const resposta = await fetch("/api/flashcard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicId,
            front: flashcard.pergunta,
            backText: flashcard.resposta,
          }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          throw new Error(
            dados.erro ||
              `Não foi possível salvar o flashcard ${salvos + 1}.`
          );
        }

        salvos++;
      }

      setSucesso(true);
      router.refresh();
    } catch (error) {
      setErro(
        `${salvos} flashcard(s) foram salvos. ${
          error instanceof Error ? error.message : "Ocorreu um erro."
        }`
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      {/* Botão superior com as mesmas dimensões do botão de avaliação */}
      <div className="flex w-[190px] flex-col items-center">
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="flex h-12 w-[190px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#202B4A] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7775A8]"
        >
          <span className="text-lg">+</span>
          Criar flashcards
        </button>
      </div>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202B4A]/35 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !salvando &&
              !carregando
            ) {
              fechar();
            }
          }}
        >
          <div className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#C6C4E0]/50 bg-[#FDFCFF] p-7 shadow-2xl shadow-[#202B4A]/20">
            <button
              type="button"
              onClick={fechar}
              disabled={carregando || salvando}
              aria-label="Fechar"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#7775A8] transition hover:bg-[#F0EFF8] disabled:opacity-40"
            >
              ×
            </button>

            {opcao === "menu" && (
              <>
                <div className="mb-8 pr-8 text-center">
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
                    NOVOS CARTÕES
                  </p>

                  <h2 className="mt-3 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                    Como deseja criar?
                  </h2>

                  <p className="mt-2 text-sm text-[#7775A8]">
                    Escolha a forma que combina com seu momento de estudo.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setOpcao("manual")}
                    className="rounded-2xl border border-[#C6C4E0]/50 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-[#7775A8] hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                      ✎
                    </span>

                    <h3 className="mt-5 font-semibold text-[#202B4A]">
                      Criar manualmente
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
                      Escreva suas próprias perguntas e respostas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpcao("ia")}
                    className="rounded-2xl border border-[#C6C4E0]/50 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-[#7775A8] hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                      ✦
                    </span>

                    <h3 className="mt-5 font-semibold text-[#202B4A]">
                      Gerar com IA
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
                      Envie um PDF e transforme seu material em flashcards.
                    </p>
                  </button>
                </div>
              </>
            )}

            {opcao === "manual" && (
              <>
                <button
                  type="button"
                  onClick={() => setOpcao("menu")}
                  className="mb-5 text-sm font-semibold text-[#7775A8] hover:text-[#202B4A]"
                >
                  ← Voltar
                </button>

                <div className="mb-6 text-center">
                  <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                    Criar manualmente
                  </h2>

                  <p className="mt-2 text-sm text-[#7775A8]">
                    Preencha a pergunta e a resposta.
                  </p>
                </div>

                <CreateFlashcardForm topicId={topicId} />
              </>
            )}

            {opcao === "ia" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpcao("menu");
                    setErro("");
                  }}
                  disabled={carregando || salvando}
                  className="mb-5 text-sm font-semibold text-[#7775A8] hover:text-[#202B4A] disabled:opacity-40"
                >
                  ← Voltar
                </button>

                <div className="mb-7 text-center">
                  <span className="text-3xl text-[#7775A8]">✦</span>

                  <h2 className="mt-3 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                    Gerar flashcards com IA
                  </h2>

                  <p className="mt-2 text-sm text-[#7775A8]">
                    Selecione o PDF que deseja transformar em cartões.
                  </p>
                </div>

                {!sucesso && flashcards.length === 0 && (
                  <>
                    <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#C6C4E0] bg-white px-5 py-10 text-center transition hover:border-[#7775A8] hover:bg-[#F8F7FC]">
                      <span className="text-3xl text-[#7775A8]">↑</span>

                      <span className="mt-4 text-sm font-semibold text-[#202B4A]">
                        Clique para selecionar seu PDF
                      </span>

                      <span className="mt-2 text-xs text-[#AAA8B8]">
                        Formato PDF
                      </span>

                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        disabled={carregando}
                        onChange={(event) => {
                          setArquivo(event.target.files?.[0] ?? null);
                          setErro("");
                        }}
                      />
                    </label>

                    {arquivo && (
                      <div className="mt-4 rounded-xl bg-[#F0EFF8] p-4 text-sm text-[#202B4A]">
                        Arquivo selecionado: {arquivo.name}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={gerarFlashcards}
                      disabled={!arquivo || carregando}
                      className="mt-5 w-full rounded-xl bg-[#202B4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7775A8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {carregando ? "Analisando PDF..." : "Gerar flashcards"}
                    </button>
                  </>
                )}

                {carregando && (
                  <p className="mt-5 text-center text-sm text-[#7775A8]">
                    A IA está analisando seu material. Isso pode levar alguns
                    instantes.
                  </p>
                )}

                {flashcards.length > 0 && !sucesso && (
                  <div className="mt-6">
                    <div className="mb-5 text-center">
                      <p className="text-sm font-semibold text-[#202B4A]">
                        {flashcards.length} flashcards gerados!
                      </p>

                      <p className="mt-1 text-xs text-[#7775A8]">
                        Confira as perguntas e respostas antes de salvar.
                      </p>
                    </div>

                    <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
                      {flashcards.map((flashcard, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-[#C6C4E0]/40 bg-white p-4"
                        >
                          <p className="text-xs font-semibold text-[#7775A8]">
                            PERGUNTA {index + 1}
                          </p>

                          <p className="mt-2 text-sm font-medium text-[#202B4A]">
                            {flashcard.pergunta}
                          </p>

                          <div className="my-3 border-t border-[#F0EFF8]" />

                          <p className="text-xs font-semibold text-[#7775A8]">
                            RESPOSTA
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-[#202B4A]">
                            {flashcard.resposta}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={salvarFlashcards}
                      disabled={salvando}
                      className="mt-5 w-full rounded-xl bg-[#202B4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7775A8] disabled:opacity-50"
                    >
                      {salvando
                        ? "Salvando flashcards..."
                        : "Salvar no tópico"}
                    </button>
                  </div>
                )}

                {sucesso && (
                  <div className="py-8 text-center">
                    <span className="text-4xl text-[#7775A8]">✓</span>

                    <h3 className="mt-4 font-[var(--font-cormorant)] text-2xl font-semibold text-[#202B4A]">
                      Flashcards salvos!
                    </h3>

                    <p className="mt-2 text-sm text-[#7775A8]">
                      Seus cartões já estão disponíveis neste tópico.
                    </p>

                    <button
                      type="button"
                      onClick={fechar}
                      className="mt-6 rounded-xl bg-[#202B4A] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#7775A8]"
                    >
                      Concluir
                    </button>
                  </div>
                )}

                {erro && (
                  <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {erro}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}