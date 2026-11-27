
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // 2. Obter o ID da matéria
    const { id: deckId } = await params;

    // 3. Verificar se a matéria pertence ao aluno
    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId: sessao.user.id,
      },
    });

    if (!deck) {
      return Response.json(
        { erro: "Matéria não encontrada." },
        { status: 404 }
      );
    }

    // 4. Ler e validar os dados enviados
    const dados: unknown = await request.json();

    if (
      typeof dados !== "object" ||
      dados === null ||
      !("name" in dados) ||
      typeof dados.name !== "string" ||
      !dados.name.trim()
    ) {
      return Response.json(
        { erro: "Informe um nome válido para o conteúdo." },
        { status: 400 }
      );
    }

    const nome = dados.name.trim();

    if (nome.length > 100) {
      return Response.json(
        { erro: "O nome do conteúdo deve ter até 100 caracteres." },
        { status: 400 }
      );
    }

    // 5. Criar o conteúdo vinculado à matéria
    const topic = await prisma.topic.create({
      data: {
        name: nome,
        deckId: deck.id,
      },
    });

    // 6. Retornar o conteúdo criado
    return Response.json(
      {
        mensagem: "Conteúdo criado com sucesso!",
        topic,
      },
      { status: 201 }
    );

  } catch (erro) {
    console.error("Erro ao criar conteúdo:", erro);

    return Response.json(
      { erro: "Não foi possível criar o conteúdo." },
      { status: 500 }
    );
  }
}
