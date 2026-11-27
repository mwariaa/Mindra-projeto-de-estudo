
"use client";

import Link from "next/link";
import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function FormularioRedefinirSenha() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function redefinirSenha(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!token) {
      setErro("Link inválido ou expirado. Solicite uma nova recuperação.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: senha,
        token,
      });

      if (error) {
        setErro(error.message || "Não foi possível redefinir sua senha.");
        return;
      }

      setSucesso("Senha redefinida com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
          className="mb-10 block text-center font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]"
        >
          Mindra<span className="text-[#7775A8]">.</span>
        </Link>

        <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-8 shadow-[0_15px_50px_rgba(32,43,74,0.06)] sm:p-10">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#7775A8]">
              RECUPERAÇÃO DE CONTA
            </span>

            <h1 className="mt-4 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
              Crie uma nova senha.
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#7775A8]">
              Escolha uma nova senha para continuar sua jornada na Mindra.
            </p>
          </div>

          <form onSubmit={redefinirSenha} className="mt-9 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                Nova senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 8 caracteres"
                required
                className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3.5 text-sm text-[#202B4A] outline-none transition placeholder:text-[#AAA8B8] focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
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
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {sucesso}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-[#202B4A] py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#7775A8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-7 block w-full text-center text-sm text-[#7775A8] transition hover:text-[#202B4A]"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </main>
  );
}

export default function RedefinirSenha() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F5F0ED] text-[#7775A8]">
          Carregando...
        </main>
      }
    >
      <FormularioRedefinirSenha />
    </Suspense>
  );
}
