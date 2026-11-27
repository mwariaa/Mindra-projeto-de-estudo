
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

    // 2. Receber os dados
    const dados: unknown = await request.json();

    if (
      typeof dados !== "object" ||
      dados === null ||
      !("materialId" in dados) ||
      !("nome" in dados) ||
      !("conteudo" in dados) ||
      !("flashcards" in dados)
    ) {
      return Response.json(
        { erro: "Dados inválidos para criar o baralho." },
        { status: 400 }
      );
    }

    const { materialId, nome, conteudo, flashcards } = dados;

    const studyGoalId =
      "studyGoalId" in dados ? dados.studyGoalId : null;

    // 3. Validar os dados principais
    if (
      typeof materialId !== "string" ||
      !materialId.trim() ||
      typeof nome !== "string" ||
      !nome.trim() ||
      nome.trim().length > 100 ||
      typeof conteudo !== "string" ||
      !conteudo.trim() ||
      conteudo.trim().length > 100 ||
      !Array.isArray(flashcards) ||
      flashcards.length === 0 ||
      flashcards.length > 100 ||
      (studyGoalId !== null &&
        studyGoalId !== undefined &&
        (typeof studyGoalId !== "string" ||
          !studyGoalId.trim()))
    ) {
      return Response.json(
        { erro: "Dados inválidos para criar o baralho." },
        { status: 400 }
      );
    }

    // 4. Verificar se o material pertence ao usuário
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        userId: sessao.user.id,
      },
    });

    if (!material) {
      return Response.json(
        { erro: "Material não encontrado." },
        { status: 404 }
      );
    }

    // 5. Verificar se a meta pertence ao usuário
    let meta = null;

    if (typeof studyGoalId === "string") {
      meta = await prisma.studyGoal.findFirst({
        where: {
          id: studyGoalId,
          userId: sessao.user.id,
        },
      });

      if (!meta) {
        return Response.json(
          { erro: "Meta de estudo não encontrada." },
          { status: 404 }
        );
      }
    }

    // 6. Validar os flashcards
    const flashcardsValidos = flashcards.every(
      (card: unknown) =>
        typeof card === "object" &&
        card !== null &&
        "pergunta" in card &&
        "resposta" in card &&
        typeof card.pergunta === "string" &&
        card.pergunta.trim().length > 0 &&
        card.pergunta.trim().length <= 2000 &&
        typeof card.resposta === "string" &&
        card.resposta.trim().length > 0 &&
        card.resposta.trim().length <= 2000
    );

    if (!flashcardsValidos) {
      return Response.json(
        { erro: "Um ou mais flashcards possuem dados inválidos." },
        { status: 400 }
      );
    }

    // 7. Criar Deck, Topic e Flashcards
    const deck = await prisma.deck.create({
      data: {
        name: nome.trim(),
        userId: sessao.user.id,
        materialId: material.id,
        studyGoalId: meta?.id ?? null,
        topics: {
          create: {
            name: conteudo.trim(),
            flashcards: {
              create: flashcards.map(
                (card: {
                  pergunta: string;
                  resposta: string;
                }) => ({
                  front: card.pergunta.trim(),
                  backText: card.resposta.trim(),
                })
              ),
            },
          },
        },
      },
      include: {
        topics: {
          include: {
            flashcards: true,
          },
        },
      },
    });

    return Response.json(
      {
        mensagem: "Baralho criado com sucesso!",
        deck,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro ao criar baralho:", erro);

    return Response.json(
      { erro: "Não foi possível criar o baralho." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    // 2. Buscar os baralhos do usuário
    const decks = await prisma.deck.findMany({
      where: {
        userId: sessao.user.id,
      },
      include: {
        topics: {
          include: {
            _count: {
              select: {
                flashcards: true,
              },
            },
          },
        },
        studyGoal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Retornar os baralhos encontrados
    return Response.json(
      {
        mensagem: "Baralhos encontrados com sucesso!",
        decks,
      },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao listar baralhos:", erro);

    return Response.json(
      { erro: "Não foi possível listar os baralhos." },
      { status: 500 }
    );
  }
}