
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const classificacoes = [
  "APROFUNDAR",
  "REVISAR",
  "DOMINANDO",
] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar autenticação
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // 2. Obter o ID do conteúdo
    const { id: topicId } = await params;

    // 3. Ler e validar a classificação
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

    // 4. Verificar se o conteúdo pertence ao aluno
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

    // 5. Registrar a avaliação
    const review = await prisma.reviewHistory.create({
      data: {
        rating: dados.rating as (typeof classificacoes)[number],
        topicId: topic.id,
        userId: sessao.user.id,
      },
    });

    // 6. Retornar o resultado
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar autenticação
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // 2. Obter o ID do conteúdo
    const { id: topicId } = await params;

    // 3. Verificar se o conteúdo pertence ao aluno
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

    // 4. Buscar o histórico de classificações
    const historico = await prisma.reviewHistory.findMany({
      where: {
        topicId: topic.id,
        userId: sessao.user.id,
      },
      orderBy: {
        reviewDate: "desc",
      },
    });

    // 5. Identificar a classificação mais recente
    const classificacaoAtual = historico[0]?.rating ?? null;

    // 6. Retornar os dados
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
