
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Contexto) {
  try {
    const sessao = await auth.api.getSession({ headers: request.headers });
    if (!sessao) {
      return Response.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 100) {
      return Response.json({ erro: "Informe um nome válido." }, { status: 400 });
    }

    const meta = await prisma.studyGoal.findFirst({
      where: { id, userId: sessao.user.id },
    });

    if (!meta) {
      return Response.json({ erro: "Meta não encontrada." }, { status: 404 });
    }

    const atualizada = await prisma.studyGoal.update({
      where: { id },
      data: { name },
    });

    return Response.json({ mensagem: "Meta atualizada!", meta: atualizada });
  } catch (error) {
    console.error("Erro ao editar meta:", error);
    return Response.json({ erro: "Não foi possível editar a meta." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  try {
    const sessao = await auth.api.getSession({ headers: request.headers });
    if (!sessao) {
      return Response.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { id } = await params;
    const meta = await prisma.studyGoal.findFirst({
      where: { id, userId: sessao.user.id },
      include: {
        decks: {
          include: {
            topics: { select: { id: true } },
          },
        },
      },
    });

    if (!meta) {
      return Response.json({ erro: "Meta não encontrada." }, { status: 404 });
    }

    const topicIds = meta.decks.flatMap((deck) =>
      deck.topics.map((topic) => topic.id)
    );
    const deckIds = meta.decks.map((deck) => deck.id);

    await prisma.$transaction(async (tx) => {
      if (topicIds.length) {
        await tx.reviewHistory.deleteMany({ where: { topicId: { in: topicIds } } });
        await tx.flashcard.deleteMany({ where: { topicId: { in: topicIds } } });
        await tx.topic.deleteMany({ where: { id: { in: topicIds } } });
      }

      if (deckIds.length) {
        await tx.deck.deleteMany({ where: { id: { in: deckIds } } });
      }

      await tx.studyGoal.delete({ where: { id } });
    });

    return Response.json({ mensagem: "Meta excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir meta:", error);
    return Response.json({ erro: "Não foi possível excluir a meta." }, { status: 500 });
  }
}
