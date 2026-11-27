"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function sair() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={sair}>
      Sair da conta
    </button>
  );
}