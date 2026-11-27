
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function solicitarRecuperacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setSucesso(false);
    setCarregando(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/redefinir-senha",
      });

      if (error) {
        setErro(error.message || "Não foi possível enviar o e-mail.");
        return;
      }

      setSucesso(true);
    } catch {
      setErro("Ocorreu um erro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0ED] px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 block text-center font-[var(--font-cormorant)] text-5xl font-semibold tracking-wide text-[#202B4A]"
        >
          Mindra<span className="text-[#7775A8]">.</span>
        </Link>

        <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-8 shadow-[0_15px_50px_rgba(32,43,74,0.06)] sm:p-10">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#7775A8]">
              RECUPERE SEU ACESSO
            </span>

            <h1 className="mt-4 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
              Esqueceu sua senha?
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#7775A8]">
              Não se preocupe! Informe seu e-mail e enviaremos um link para
              você criar uma nova senha.
            </p>
          </div>

          <form onSubmit={solicitarRecuperacao} className="mt-9 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                E-mail cadastrado
              </label>

              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3.5 text-sm text-[#202B4A] outline-none transition placeholder:text-[#AAA8B8] focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
              />
            </div>

            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {erro}
              </p>
            )}

            {sucesso && (
              <p className="rounded-xl bg-[#F0EFF8] px-4 py-3 text-sm leading-relaxed text-[#7775A8]">
                Se o endereço estiver cadastrado, você receberá um e-mail
                com as instruções para redefinir sua senha.
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-[#202B4A] py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#7775A8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#7775A8]">
            Lembrou sua senha?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#202B4A] underline decoration-[#C6C4E0] underline-offset-4 transition hover:text-[#7775A8]"
            >
              Voltar para entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
