"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password: senha,
      });

      if (error) {
        setErro(error.message || "E-mail ou senha incorretos.");
        return;
      }

      router.push("/inicio");
    } catch {
      setErro("Não foi possível entrar. Tente novamente.");
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
              BEM-VINDA DE VOLTA
            </span>

            <h1 className="mt-4 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
              Que bom ter você aqui.
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#7775A8]">
              Entre na sua conta e continue sua jornada de aprendizado.
            </p>
          </div>

          <form onSubmit={entrar} className="mt-9 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                E-mail
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

            <div>
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                Senha
              </label>

              <input
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3.5 text-sm text-[#202B4A] outline-none transition placeholder:text-[#AAA8B8] focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/esqueci-senha"
                className="text-sm font-medium text-[#7775A8] transition hover:text-[#202B4A]"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-[#202B4A] py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#7775A8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar na minha conta"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#EAE7E5]" />
            <span className="text-xs text-[#AAA8B8]">OU</span>
            <div className="h-px flex-1 bg-[#EAE7E5]" />
          </div>

          <p className="text-center text-sm text-[#7775A8]">
            Ainda não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-[#202B4A] underline decoration-[#C6C4E0] underline-offset-4 transition hover:text-[#7775A8]"
            >
              Criar conta
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="mt-7 block text-center text-sm text-[#7775A8] transition hover:text-[#202B4A]"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}