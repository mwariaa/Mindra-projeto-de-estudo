import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import FlashcardViewer from "@/components/FlashcardViewer";
import FlashcardCreation from "@/components/FlashcardCreation";
import TopicRating from "@/components/TopicRating";

export const instant = false;

interface TopicPageProps {
  params: Promise<{
    id: string;
    deckId: string;
    topicId: string;
  }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id, deckId, topicId } = await params;

  const session = await getSession();

  if (!session) redirect("/login");

  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      deckId,
      deck: {
        userId: session.user.id,
        studyGoalId: id,
      },
    },
    include: {
      deck: true,
      flashcards: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!topic) notFound();

  const flashcards = topic.flashcards.map((flashcard) => ({
    id: flashcard.id,
    front: flashcard.front,
    backText: flashcard.backText,
  }));

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <div className="min-w-0 flex-1 px-6 py-10 md:px-10">

        {/* Botões no topo, alinhados à direita */}
        <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
          <FlashcardCreation topicId={topicId} />
          <TopicRating topicId={topicId} />
        </div>

        <Link
          href={`/estudos/${id}/${deckId}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#C6C4E0]/60 bg-white px-5 py-2.5 text-sm font-semibold text-[#202B4A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7775A8] hover:text-[#7775A8]"
        >
          <span>←</span> Voltar para matéria
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
            {topic.deck.name.toUpperCase()}
          </p>

          <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold text-[#202B4A]">
            {topic.name}.
          </h1>

          <p className="mt-2 text-sm text-[#7775A8]">
            Seus cartões de estudo.
          </p>
        </header>

        <section className="mx-auto w-full">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
              MOMENTO DE REVISÃO
            </p>

            <h2 className="mt-2 font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
              Hora de memorizar.
            </h2>
          </div>

          {flashcards.length > 0 ? (
            <FlashcardViewer flashcards={flashcards} />
          ) : (
            <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white px-6 py-12 text-center">
              <span className="text-3xl text-[#C6C4E0]">✦</span>

              <p className="mt-4 text-sm text-[#7775A8]">
                Seus flashcards aparecerão aqui depois de cadastrados.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}