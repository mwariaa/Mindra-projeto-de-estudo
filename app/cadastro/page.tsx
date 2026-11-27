"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await authClient.signUp.email({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });

      if (error) {
        throw new Error(error.message || "Não foi possível criar sua conta.");
      }

      setMensagem(
        "Conta criada! Enviamos um e-mail para você confirmar seu cadastro. Verifique sua caixa de entrada e o spam."
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao criar sua conta."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0ED] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]"
          >
            mindra.
          </Link>

          <p className="mt-3 text-sm text-[#7775A8]">
            Aprenda. Lembre. Evolua.
          </p>
        </div>

        <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-8 shadow-sm">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7775A8]">
              CRIE SUA CONTA
            </p>

            <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
              Comece sua jornada.
            </h1>

            <p className="mt-2 text-sm text-[#7775A8]">
              Crie sua conta e organize seus estudos.
            </p>
          </div>

          {mensagem ? (
            <div className="rounded-2xl bg-[#F0EFF8] p-5">
              <p className="text-sm leading-relaxed text-[#202B4A]">
                {mensagem}
              </p>

              <Link
                href="/login"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#303e65]"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={cadastrar} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Nome completo
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Senha
                </label>

                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#202B4A]">
                  Confirmar senha
                </label>

                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className="w-full rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] px-4 py-3 text-sm text-[#202B4A] outline-none transition focus:border-[#7775A8] focus:ring-2 focus:ring-[#7775A8]/10"
                />
              </div>

              {erro && (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-xl bg-[#7775A8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#202B4A] disabled:opacity-50"
              >
                {carregando ? "Criando conta..." : "Criar minha conta"}
              </button>
            </form>
          )}

          {!mensagem && (
            <p className="mt-7 text-center text-sm text-[#7775A8]">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#202B4A] hover:underline"
              >
                Entrar
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}