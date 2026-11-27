import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProfileMenu from "@/components/ProfileMenu";

export const instant = false;

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <div className="min-w-0 flex-1 px-10 py-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#7775A8]">
              SEU ESPAÇO DE APRENDIZADO
            </p>

            <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
              Bem-vindo à Mindra.
            </h1>

            <p className="mt-2 text-[#7775A8]">
              Organize seus estudos e continue construindo conhecimento.
            </p>
          </div>

          <ProfileMenu
            nome={session.user.name || "Usuário"}
            email={session.user.email}
          />
        </header>

        <section className="rounded-[2rem] bg-[#202B4A] p-9 text-white">
          <p className="text-sm tracking-[0.2em] text-[#C6C4E0]">
            SUA JORNADA COMEÇA AQUI
          </p>

          <h2 className="mt-4 max-w-xl font-[var(--font-cormorant)] text-4xl font-semibold leading-tight md:text-5xl">
            Aprenda. Lembre. Evolua.
          </h2>

          <p className="mt-4 max-w-lg leading-relaxed text-[#D5D3E8]">
            Transforme seus estudos em uma experiência mais organizada,
            inteligente e eficiente.
          </p>

          <Link
            href="/criar-flashcards"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-[#202B4A] transition hover:bg-[#C6C4E0]"
          >
            Começar a estudar
          </Link>
        </section>

        <section id="criar" className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#202B4A]">
              O que deseja fazer?
            </h2>
            <p className="mt-1 text-sm text-[#7775A8]">
              Escolha como deseja continuar seus estudos.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/criar-flashcards"
              className="group rounded-3xl border border-[#C6C4E0]/40 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                ✎
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#202B4A]">
                Criar flashcards
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
                Monte suas próprias perguntas e respostas manualmente ou com IA.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#7775A8]">
                Criar flashcards →
              </p>
            </Link>

            <Link
              href="/estudos"
              className="group rounded-3xl border border-[#C6C4E0]/40 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                ✦
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#202B4A]">
                Meus estudos
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#7775A8]">
                Organize suas metas, matérias e conteúdos de estudo.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#7775A8]">
                Acessar estudos →
              </p>
            </Link>
          </div>
        </section>

        <section id="estudos" className="mt-12">
          <h2 className="text-2xl font-semibold text-[#202B4A]">
            Meus estudos
          </h2>

          <div className="mt-5 rounded-3xl border border-[#C6C4E0]/40 bg-white p-8">
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EFF8] text-3xl text-[#7775A8]">
                ▤
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#202B4A]">
                Seus estudos aparecerão aqui
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#7775A8]">
                Crie uma meta de estudo, organize suas matérias e
                comece a montar seus conteúdos.
              </p>
            </div>
          </div>
        </section>

        <section id="progresso" className="mt-12">
          <h2 className="text-2xl font-semibold text-[#202B4A]">
            Meu progresso
          </h2>

          <div className="mt-5 rounded-3xl border border-[#C6C4E0]/40 bg-white p-8">
            <p className="text-sm leading-relaxed text-[#7775A8]">
              Conforme você avaliar seus conteúdos como Aprofundar,
              Revisar ou Dominando, sua evolução será apresentada aqui.
            </p>
          </div>
        </section>

        <footer className="mt-16 border-t border-[#C6C4E0]/40 py-6 text-center text-sm text-[#AAA8B8]">
          Mindra · Aprenda. Lembre. Evolua.
        </footer>
      </div>
    </main>
  );
}