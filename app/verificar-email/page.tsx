
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function VerificarEmail() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function reenviarEmail() {
    if (!email) {
      setMensagem("Informe seu e-mail.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    const { error } = await authClient.sendVerificationEmail({
      email: email,
      callbackURL: "/login",
    });

    setCarregando(false);

    if (error) {
      setMensagem(error.message ?? "Ocorreu um erro ao reenviar o e-mail.");
      return;
    }

    setMensagem("Solicitação enviada! Confira sua caixa de entrada.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">
          Verifique seu e-mail
        </h1>

        <p className="mt-4 text-zinc-600">
          Enviamos um link de confirmação para seu endereço de e-mail.
        </p>

        <p className="mt-2 text-zinc-500">
          Acesse sua caixa de entrada e clique no link para ativar sua conta.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3"
          />

          <button
            onClick={reenviarEmail}
            disabled={carregando}
            className="w-full rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {carregando ? "Enviando..." : "Reenviar e-mail"}
          </button>

          {mensagem && (
            <p className="text-sm text-zinc-600">{mensagem}</p>
          )}
        </div>
      </div>
    </main>
  );
}
