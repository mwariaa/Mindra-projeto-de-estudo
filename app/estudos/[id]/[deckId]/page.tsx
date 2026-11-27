import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import CreateTopicModal from "@/components/CreateTopicModal";
import EntityActions from "@/components/EntityActions";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
    deckId: string;
  }>;
}

export default async function MateriaPage({ params }: PageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id, deckId } = await params;

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId: session.user.id,
      studyGoalId: id,
    },
    include: {
      studyGoal: true,
      topics: {
        include: {
          _count: {
            select: {
              flashcards: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!deck) {
    notFound();
  }

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <section className="min-w-0 flex-1 px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl">

          <Link
            href={`/estudos/${id}`}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-[#C6C4E0] bg-white px-5 py-3 text-sm font-medium text-[#202B4A] shadow-sm transition hover:bg-[#F0EFF8]"
          >
            <span>←</span>
            Voltar para {deck.studyGoal?.name ?? "Meus estudos"}
          </Link>

          {/* Cabeçalho da matéria */}
          <header className="mb-12">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#7775A8]">
                  Matéria
                </p>

                <h1 className="font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]">
                  {deck.name}
                </h1>

                <p className="mt-3 text-sm text-[#7775A8]">
                  Organize os conteúdos desta matéria e estude com seus flashcards.
                </p>
              </div>

              <EntityActions
                id={deck.id}
                nome={deck.name}
                tipo="materia"
                endpoint={`/api/decks/${deck.id}`}
              />
            </div>
          </header>

          {/* Conteúdos */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Conteúdos
              </h2>

              <p className="mt-1 text-sm text-[#7775A8]">
                Cada conteúdo pode ter seus próprios flashcards.
              </p>
            </div>

            <CreateTopicModal deckId={deck.id} />
          </div>

          {deck.topics.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C6C4E0] bg-white/70 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EFF8] text-2xl text-[#7775A8]">
                ✦
              </div>

              <h3 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Nenhum conteúdo por aqui
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#7775A8]">
                Crie seu primeiro conteúdo para começar a adicionar flashcards.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {deck.topics.map((topic) => (
                <article
                  key={topic.id}
                  className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-[#7775A8]">
                        Conteúdo
                      </span>

                      <h3 className="mt-2 break-words font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                        {topic.name}
                      </h3>
                    </div>

                    <EntityActions
                      id={topic.id}
                      nome={topic.name}
                      tipo="conteudo"
                      endpoint={`/api/topics/${topic.id}`}
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0EFF8] text-sm text-[#7775A8]">
                      ▤
                    </span>

                    <p className="text-sm text-[#7775A8]">
                      {topic._count.flashcards}{" "}
                      {topic._count.flashcards === 1
                        ? "flashcard"
                        : "flashcards"}
                    </p>
                  </div>

                  <Link
                    href={`/estudos/${id}/${deck.id}/${topic.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#303e65]"
                  >
                    Acessar conteúdo
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