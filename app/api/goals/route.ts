
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
      !("nome" in dados) ||
      typeof dados.nome !== "string" ||
      !dados.nome.trim() ||
      dados.nome.trim().length > 100
    ) {
      return Response.json(
        { erro: "Nome da meta inválido." },
        { status: 400 }
      );
    }

    // 3. Criar a meta vinculada ao usuário
    const meta = await prisma.studyGoal.create({
      data: {
        name: dados.nome.trim(),
        userId: sessao.user.id,
      },
    });

    return Response.json(
      {
        mensagem: "Meta criada com sucesso!",
        meta,
      },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro ao criar meta:", erro);

    return Response.json(
      { erro: "Não foi possível criar a meta." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    const metas = await prisma.studyGoal.findMany({
      where: {
        userId: sessao.user.id,
      },
      include: {
        decks: {
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

    return Response.json({ metas }, { status: 200 });
  } catch (erro) {
    console.error("Erro ao listar metas:", erro);

    return Response.json(
      { erro: "Não foi possível listar as metas." },
      { status: 500 }
    );
  }
}
