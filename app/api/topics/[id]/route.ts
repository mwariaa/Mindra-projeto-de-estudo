
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const classificacoes = [
  "APROFUNDAR",
  "REVISAR",
  "DOMINANDO",
] as const;

// REGISTRAR CLASSIFICAÇÃO
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: topicId } = await params;
    const dados: unknown = await request.json();

    if (
      typeof dados !== "object" ||
      dados === null ||
      !("rating" in dados) ||
      typeof dados.rating !== "string" ||
      !classificacoes.includes(
        dados.rating as (typeof classificacoes)[number]
      )
    ) {
      return Response.json(
        { erro: "Classificação inválida." },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        deck: {
          userId: sessao.user.id,
        },
      },
    });

    if (!topic) {
      return Response.json(
        { erro: "Conteúdo não encontrado." },
        { status: 404 }
      );
    }

    const review = await prisma.reviewHistory.create({
      data: {
        rating: dados.rating as (typeof classificacoes)[number],
        topicId: topic.id,
        userId: sessao.user.id,
      },
    });

    return Response.json(
      {
        mensagem: "Classificação registrada com sucesso!",
        review,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro ao registrar classificação:", erro);

    return Response.json(
      { erro: "Não foi possível registrar a classificação." },
      { status: 500 }
    );
  }
}

// CONSULTAR HISTÓRICO
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: topicId } = await params;

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        deck: {
          userId: sessao.user.id,
        },
      },
    });

    if (!topic) {
      return Response.json(
        { erro: "Conteúdo não encontrado." },
        { status: 404 }
      );
    }

    const historico = await prisma.reviewHistory.findMany({
      where: {
        topicId: topic.id,
        userId: sessao.user.id,
      },
      orderBy: {
        reviewDate: "desc",
      },
    });

    const classificacaoAtual = historico[0]?.rating ?? null;

    return Response.json({
      mensagem: "Histórico encontrado com sucesso!",
      topic: {
        id: topic.id,
        name: topic.name,
      },
      classificacaoAtual,
      totalAvaliacoes: historico.length,
      historico,
    });
  } catch (erro) {
    console.error("Erro ao consultar histórico:", erro);

    return Response.json(
      { erro: "Não foi possível consultar o histórico." },
      { status: 500 }
    );
  }
}

// EXCLUIR CONTEÚDO
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: topicId } = await params;

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        deck: {
          userId: sessao.user.id,
        },
      },
    });

    if (!topic) {
      return Response.json(
        { erro: "Conteúdo não encontrado." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.reviewHistory.deleteMany({
        where: {
          topicId: topic.id,
          userId: sessao.user.id,
        },
      });

      await tx.flashcard.deleteMany({
        where: {
          topicId: topic.id,
        },
      });

      await tx.topic.delete({
        where: {
          id: topic.id,
        },
      });
    });

    return Response.json({
      mensagem: "Conteúdo e seus flashcards excluídos com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir conteúdo:", erro);

    return Response.json(
      { erro: "Não foi possível excluir o conteúdo." },
      { status: 500 }
    );
  }
}
