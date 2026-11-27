"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileMenu from "@/components/ProfileMenu";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  { label: "Início", href: "/inicio", icon: "⌂" },
  { label: "Meus estudos", href: "/estudos", icon: "▤" },
  { label: "Criar flashcards", href: "/criar-flashcards", icon: "▧" },
  { label: "Meu progresso", href: "/progresso", icon: "↗" },
  { label: "Configurações", href: "/configuracoes", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: sessao } = authClient.useSession();

  const [nome, setNome] = useState("Usuário");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (sessao?.user) {
      setNome(sessao.user.name || "Usuário");
      setEmail(sessao.user.email || "");
    }
  }, [sessao]);

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-[#E8E3E0] bg-white px-5 py-8">
      <Link
        href="/inicio"
        className="mb-12 text-3xl font-semibold tracking-tight text-[#202B4A]"
      >
        mindra<span className="text-[#7775A8]">.</span>
      </Link>

      <p className="mb-4 px-3 text-xs font-semibold tracking-[0.18em] text-[#A5A0B5]">
        MENU
      </p>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const ativo =
            pathname === item.href ||
            (item.href !== "/inicio" &&
              pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                ativo
                  ? "bg-[#F0EFF7] font-semibold text-[#7775A8]"
                  : "text-[#7775A8] hover:bg-[#F8F6F5] hover:text-[#202B4A]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#E8E3E0] pt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8F7FB] p-3">
          <ProfileMenu
            nome={nome}
            email={email}
            lado="esquerdo"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#202B4A]">
              {nome}
            </p>
            <p className="text-xs text-[#7775A8]">Minha conta</p>
          </div>
        </div>

        <p className="mt-4 px-3 text-xs text-[#A5A0B5]">
          Seu espaço de aprendizado.
        </p>
      </div>
    </aside>
  );
}