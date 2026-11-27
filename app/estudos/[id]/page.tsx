import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CreateDeckModal from "@/components/CreateDeckModal";

export const instant = false;

export default async function MetaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const meta = await prisma.studyGoal.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      decks: {
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!meta) {
    notFound();
  }

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <div className="min-w-0 flex-1 px-10 py-12">
        <Link
          href="/estudos"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#202B4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#7775A8] hover:shadow-lg"
        >
          <span>←</span>
          Voltar para meus estudos
        </Link>

        <header className="mb-12 mt-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
            SUA META DE ESTUDO
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]">
            {meta.name}.
          </h1>

          <p className="mt-3 text-sm text-[#7775A8]">
            Organize suas matérias e acompanhe sua evolução.
          </p>
        </header>

        <section>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#202B4A]">
                Matérias
              </h2>

              <p className="mt-1 text-sm text-[#7775A8]">
                Os assuntos que fazem parte dessa meta.
              </p>
            </div>

            <CreateDeckModal studyGoalId={meta.id} />
          </div>

          {meta.decks.length === 0 ? (
            <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EFF8] text-3xl text-[#7775A8]">
                ▤
              </div>

              <h3 className="mt-6 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Suas matérias começam aqui.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm text-[#7775A8]">
                Adicione matérias para organizar os conteúdos que você precisa
                estudar.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {meta.decks.map((deck) => (
                <article
                  key={deck.id}
                  className="rounded-3xl border border-[#C6C4E0]/40 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#202B4A]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EFF8] text-xl text-[#7775A8]">
                    ▤
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#202B4A]">
                    {deck.name}
                  </h3>

                  <p className="mt-2 text-sm text-[#7775A8]">
                    Matéria de estudo
                  </p>

                  <div className="mt-6 border-t border-[#F0EFF8] pt-5">
                    <Link
                      href={`/estudos/${meta.id}/${deck.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#F0EFF8] px-4 py-2.5 text-sm font-semibold text-[#7775A8] transition hover:bg-[#7775A8] hover:text-white"
                    >
                      Acessar matéria
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}