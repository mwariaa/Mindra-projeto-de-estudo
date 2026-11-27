
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import CreateIndependentDeckModal from "@/components/CreateIndependentDeckModal";
import EntityActions from "@/components/EntityActions";

export const instant = false;

export default async function CriarFlashcardsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const materias = await prisma.deck.findMany({
    where: {
      userId: session.user.id,
      studyGoalId: null,
    },
    include: {
      _count: {
        select: {
          topics: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <section className="min-w-0 flex-1 px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7775A8]">
              Criação de materiais
            </p>

            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h1 className="font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]">
                  Criar flashcards.
                </h1>

                <p className="mt-3 text-sm text-[#7775A8]">
                  Crie suas próprias matérias e organize seus conteúdos.
                </p>
              </div>

              <CreateIndependentDeckModal />
            </div>
          </header>

          <div className="mb-6">
            <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
              Minhas matérias
            </h2>

            <p className="mt-1 text-sm text-[#7775A8]">
              Matérias criadas independentemente das suas metas.
            </p>
          </div>

          {materias.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C6C4E0] bg-white/70 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                ✦
              </div>

              <h3 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Nenhuma matéria criada
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#7775A8]">
                Crie uma matéria para começar a organizar seus conteúdos e
                produzir flashcards.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {materias.map((materia) => (
                <article
                  key={materia.id}
                  className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-[#7775A8]">
                        Matéria independente
                      </span>

                      <h3 className="mt-2 break-words font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                        {materia.name}
                      </h3>
                    </div>

                    <EntityActions
                      id={materia.id}
                      nome={materia.name}
                      tipo="materia"
                      endpoint={`/api/decks/${materia.id}`}
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0EFF8] text-sm text-[#7775A8]">
                      ▤
                    </span>

                    <p className="text-sm text-[#7775A8]">
                      {materia._count.topics}{" "}
                      {materia._count.topics === 1
                        ? "conteúdo"
                        : "conteúdos"}
                    </p>
                  </div>

                  <Link
                    href={`/criar-flashcards/${materia.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#303e65]"
                  >
                    Acessar matéria
                    <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
