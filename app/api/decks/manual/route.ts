
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Verificar se o usuário está autenticado
    const sessao = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessao) {
      return Response.json(
        { erro: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    // 2. Receber os dados
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const studyGoalId =
      typeof body.studyGoalId === "string" && body.studyGoalId.trim()
        ? body.studyGoalId.trim()
        : null;

    // 3. Validar o nome
    if (!name || name.length > 100) {
      return Response.json(
        { erro: "Informe um nome válido para a matéria." },
        { status: 400 }
      );
    }

    // 4. Se uma meta foi informada, verificar se pertence ao usuário
    if (studyGoalId) {
      const meta = await prisma.studyGoal.findFirst({
        where: {
          id: studyGoalId,
          userId: sessao.user.id,
        },
      });

      if (!meta) {
        return Response.json(
          { erro: "Meta não encontrada." },
          { status: 404 }
        );
      }
    }

    // 5. Criar a matéria com ou sem meta
    const materia = await prisma.deck.create({
      data: {
        name,
        userId: sessao.user.id,
        studyGoalId,
      },
    });

    return Response.json(
      {
        mensagem: "Matéria criada com sucesso!",
        deck: materia,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar matéria:", error);

    return Response.json(
      { erro: "Não foi possível criar a matéria." },
      { status: 500 }
    );
  }
}
