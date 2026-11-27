
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// CRIAR FLASHCARD
export async function POST(request: Request) {
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

    const dados: unknown = await request.json();

    if (
      typeof dados !== "object" ||
      dados === null ||
      !("topicId" in dados) ||
      !("front" in dados) ||
      !("backText" in dados)
    ) {
      return Response.json(
        { erro: "Dados inválidos para criar o flashcard." },
        { status: 400 }
      );
    }

    const { topicId, front, backText } = dados;

    if (
      typeof topicId !== "string" ||
      !topicId.trim() ||
      typeof front !== "string" ||
      !front.trim() ||
      front.trim().length > 2000 ||
      typeof backText !== "string" ||
      !backText.trim() ||
      backText.trim().length > 2000
    ) {
      return Response.json(
        { erro: "Dados inválidos para criar o flashcard." },
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

    const flashcard = await prisma.flashcard.create({
      data: {
        front: front.trim(),
        backText: backText.trim(),
        topicId: topic.id,
      },
    });

    return Response.json(
      {
        mensagem: "Flashcard criado com sucesso!",
        flashcard,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro ao criar flashcard:", erro);

    return Response.json(
      { erro: "Não foi possível criar o flashcard." },
      { status: 500 }
    );
  }
}

// EDITAR FLASHCARD
export async function PATCH(request: Request) {
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

    const dados = await request.json();

    const { flashcardId, front, backText } = dados;

    if (
      typeof flashcardId !== "string" ||
      !flashcardId.trim() ||
      typeof front !== "string" ||
      !front.trim() ||
      front.trim().length > 2000 ||
      typeof backText !== "string" ||
      !backText.trim() ||
      backText.trim().length > 2000
    ) {
      return Response.json(
        { erro: "Informe uma pergunta e uma resposta válidas." },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        topic: {
          deck: {
            userId: sessao.user.id,
          },
        },
      },
    });

    if (!flashcard) {
      return Response.json(
        { erro: "Flashcard não encontrado." },
        { status: 404 }
      );
    }

    const atualizado = await prisma.flashcard.update({
      where: {
        id: flashcardId,
      },
      data: {
        front: front.trim(),
        backText: backText.trim(),
      },
    });

    return Response.json({
      mensagem: "Flashcard atualizado com sucesso!",
      flashcard: atualizado,
    });
  } catch (erro) {
    console.error("Erro ao editar flashcard:", erro);

    return Response.json(
      { erro: "Não foi possível editar o flashcard." },
      { status: 500 }
    );
  }
}

// EXCLUIR FLASHCARD
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const flashcardId = searchParams.get("id");

    if (!flashcardId) {
      return Response.json(
        { erro: "ID do flashcard não informado." },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        topic: {
          deck: {
            userId: sessao.user.id,
          },
        },
      },
    });

    if (!flashcard) {
      return Response.json(
        { erro: "Flashcard não encontrado." },
        { status: 404 }
      );
    }

    await prisma.flashcard.delete({
      where: {
        id: flashcardId,
      },
    });

    return Response.json({
      mensagem: "Flashcard excluído com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir flashcard:", erro);

    return Response.json(
      { erro: "Não foi possível excluir o flashcard." },
      { status: 500 }
    );
  }
}
