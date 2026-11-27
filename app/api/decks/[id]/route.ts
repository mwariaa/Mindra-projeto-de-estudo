
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Contexto = {
  params: Promise<{ id: string }>;
};

// GET — Buscar matéria e seus conteúdos/flashcards
export async function GET(
  request: Request,
  { params }: Contexto
) {
  try {
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const deck = await prisma.deck.findFirst({
      where: {
        id,
        userId: sessao.user.id,
      },
      include: {
        topics: {
          include: {
            flashcards: true,
          },
        },
        studyGoal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!deck) {
      return Response.json(
        { erro: "Baralho não encontrado." },
        { status: 404 }
      );
    }

    return Response.json(
      {
        mensagem: "Baralho encontrado com sucesso!",
        deck,
      },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao buscar baralho:", erro);

    return Response.json(
      { erro: "Não foi possível buscar o baralho." },
      { status: 500 }
    );
  }
}

// PATCH — Editar nome da matéria
export async function PATCH(
  request: Request,
  { params }: Contexto
) {
  try {
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const name =
      typeof body?.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 100) {
      return Response.json(
        { erro: "Informe um nome válido para a matéria." },
        { status: 400 }
      );
    }

    const materia = await prisma.deck.findFirst({
      where: {
        id,
        userId: sessao.user.id,
      },
    });

    if (!materia) {
      return Response.json(
        { erro: "Matéria não encontrada." },
        { status: 404 }
      );
    }

    const atualizada = await prisma.deck.update({
      where: { id },
      data: { name },
    });

    return Response.json(
      {
        mensagem: "Matéria atualizada com sucesso!",
        deck: atualizada,
      },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao editar matéria:", erro);

    return Response.json(
      { erro: "Não foi possível editar a matéria." },
      { status: 500 }
    );
  }
}

// DELETE — Excluir matéria, conteúdos, flashcards e avaliações
export async function DELETE(
  request: Request,
  { params }: Contexto
) {
  try {
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const materia = await prisma.deck.findFirst({
      where: {
        id,
        userId: sessao.user.id,
      },
      include: {
        topics: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!materia) {
      return Response.json(
        { erro: "Matéria não encontrada." },
        { status: 404 }
      );
    }

    const topicIds = materia.topics.map((topic) => topic.id);

    await prisma.$transaction(async (tx) => {
      if (topicIds.length > 0) {
        await tx.reviewHistory.deleteMany({
          where: {
            topicId: { in: topicIds },
          },
        });

        await tx.flashcard.deleteMany({
          where: {
            topicId: { in: topicIds },
          },
        });

        await tx.topic.deleteMany({
          where: {
            id: { in: topicIds },
          },
        });
      }

      await tx.deck.delete({
        where: { id },
      });
    });

    return Response.json(
      { mensagem: "Matéria e todos os seus conteúdos foram excluídos com sucesso!" },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao excluir matéria:", erro);

    return Response.json(
      { erro: "Não foi possível excluir a matéria." },
      { status: 500 }
    );
  }
}
