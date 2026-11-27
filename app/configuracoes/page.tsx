"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { authClient } from "@/lib/auth-client";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { data: sessao, isPending } = authClient.useSession();

  const [nome, setNome] = useState("");

  const [carregandoNome, setCarregandoNome] = useState(false);
  const [erroNome, setErroNome] = useState("");
  const [sucessoNome, setSucessoNome] = useState("");

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [carregandoExclusao, setCarregandoExclusao] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  useEffect(() => {
    if (sessao?.user) {
      setNome(sessao.user.name || "");
    }
  }, [sessao]);

  useEffect(() => {
    if (!isPending && !sessao) {
      router.replace("/login");
    }
  }, [isPending, sessao, router]);

  async function atualizarNome(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroNome("");
    setSucessoNome("");

    if (!nome.trim()) {
      setErroNome("Informe seu nome.");
      return;
    }

    setCarregandoNome(true);

    try {
      const { error } = await authClient.updateUser({
        name: nome.trim(),
      });

      if (error) {
        setErroNome(error.message || "Não foi possível atualizar seu nome.");
        return;
      }

      setSucessoNome("Nome atualizado com sucesso!");
    } catch {
      setErroNome("Ocorreu um erro ao atualizar seus dados.");
    } finally {
      setCarregandoNome(false);
    }
  }

  async function excluirConta() {
    if (!senhaExclusao) {
      setErroExclusao("Informe sua senha para continuar.");
      return;
    }

    setCarregandoExclusao(true);
    setErroExclusao("");

    try {
      const resposta = await fetch("/api/conta", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senha: senhaExclusao,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErroExclusao(
          resultado.mensagem || "Não foi possível excluir sua conta."
        );
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setErroExclusao("Ocorreu um erro ao excluir sua conta.");
    } finally {
      setCarregandoExclusao(false);
    }
  }

  async function sair() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  const estiloInput =
    "w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3.5 text-sm text-[#202B4A] outline-none transition placeholder:text-[#AAA8B8] focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10";

  if (isPending || !sessao) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0ED]">
        <p className="text-sm text-[#7775A8]">Carregando configurações...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <div className="min-w-0 flex-1 px-6 py-10 sm:px-10 sm:py-12">
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
            SUA CONTA
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]">
            Configurações.
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#7775A8]">
            Gerencie seus dados e mantenha sua conta sempre atualizada.
          </p>
        </header>

        <div className="max-w-3xl space-y-6">
          <section className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-7 shadow-[0_10px_35px_rgba(32,43,74,0.04)] sm:p-9">
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-[#202B4A]">
                Dados pessoais
              </h2>
              <p className="mt-2 text-sm text-[#7775A8]">
                Atualize as informações da sua conta.
              </p>
            </div>

            <form onSubmit={atualizarNome} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  E-mail
                </label>
                <input
                  type="email"
                  value={sessao.user.email}
                  disabled
                  className={`${estiloInput} cursor-not-allowed opacity-60`}
                />
                <p className="mt-2 text-xs text-[#AAA8B8]">
                  O e-mail da conta não pode ser alterado por esta tela.
                </p>
              </div>

              {erroNome && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {erroNome}
                </p>
              )}

              {sucessoNome && (
                <p className="rounded-xl bg-[#F0EFF8] px-4 py-3 text-sm text-[#7775A8]">
                  {sucessoNome}
                </p>
              )}

              <button
                type="submit"
                disabled={carregandoNome}
                className="rounded-xl bg-[#202B4A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7775A8] disabled:opacity-50"
              >
                {carregandoNome ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-red-100 bg-white p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-[#202B4A]">
              Encerrar sessão
            </h2>

            <p className="mt-2 text-sm text-[#7775A8]">
              Saia da sua conta neste dispositivo.
            </p>

            <button
              type="button"
              onClick={sair}
              className="mt-5 rounded-xl border border-red-200 px-7 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Sair da conta
            </button>
          </section>

          <section className="rounded-3xl border border-red-200 bg-white p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-red-600">
              Excluir conta
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
              Exclua permanentemente sua conta e todos os seus dados de estudo.
              Essa ação não poderá ser desfeita.
            </p>

            <button
              type="button"
              onClick={() => {
                setMostrarConfirmacao(true);
                setSenhaExclusao("");
                setErroExclusao("");
              }}
              className="mt-5 rounded-xl border border-red-200 px-7 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Excluir minha conta
            </button>
          </section>
        </div>
      </div>

      {mostrarConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B4A]/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-9">
            <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
              Tem certeza?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#7775A8]">
              Você está prestes a excluir sua conta permanentemente. Todas as
              suas metas, matérias, conteúdos, flashcards e histórico de
              progresso serão apagados.
            </p>

            <p className="mt-5 text-sm font-medium text-[#202B4A]">
              Confirme sua senha atual:
            </p>

            <input
              type="password"
              value={senhaExclusao}
              onChange={(e) => setSenhaExclusao(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              className={`${estiloInput} mt-2`}
            />

            {erroExclusao && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {erroExclusao}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={carregandoExclusao}
                onClick={() => {
                  setMostrarConfirmacao(false);
                  setSenhaExclusao("");
                  setErroExclusao("");
                }}
                className="rounded-xl border border-[#C6C4E0] px-5 py-3 text-sm font-semibold text-[#7775A8] transition hover:bg-[#F0EFF8] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={carregandoExclusao}
                onClick={excluirConta}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {carregandoExclusao
                  ? "Excluindo..."
                  : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}