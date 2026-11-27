
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface ProfileMenuProps {
  nome: string;
  email: string;
  lado?: "esquerdo" | "direito";
}

export default function ProfileMenu({
  nome,
  email,
  lado = "direito",
}: ProfileMenuProps) {
  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const router = useRouter();

  const inicial = nome.trim().charAt(0).toUpperCase() || "M";

  async function sair() {
    setSaindo(true);

    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setSaindo(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-label="Abrir menu da conta"
        aria-expanded={aberto}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7775A8] text-lg font-semibold text-white shadow-sm transition hover:scale-105 hover:bg-[#202B4A]"
      >
        {inicial}
      </button>

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            className={`absolute top-0 z-50 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#C6C4E0]/50 bg-white p-3 shadow-xl shadow-[#202B4A]/10 ${
              lado === "esquerdo" ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7775A8] text-lg font-semibold text-white">
                {inicial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#202B4A]">
                  {nome}
                </p>
                <p className="truncate text-xs text-[#7775A8]">
                  {email}
                </p>
              </div>
            </div>

            <div className="my-2 border-t border-[#F0EFF8]" />

            <button
              type="button"
              onClick={() => {
                setAberto(false);
                router.push("/configuracoes");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#202B4A] transition hover:bg-[#F0EFF8]"
            >
              <span className="text-lg text-[#7775A8]">⚙</span>
              Editar conta
            </button>

            <button
              type="button"
              onClick={sair}
              disabled={saindo}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <span className="text-lg">↪</span>
              {saindo ? "Saindo..." : "Sair da conta"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
