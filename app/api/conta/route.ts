
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function DELETE(request: Request) {
  try {
    const cabecalhos = await headers();

    const sessao = await auth.api.getSession({
      headers: cabecalhos,
    });

    if (!sessao) {
      return Response.json(
        { mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const senha = body.senha;

    if (typeof senha !== "string" || !senha) {
      return Response.json(
        { mensagem: "Informe sua senha para continuar." },
        { status: 400 }
      );
    }

    // Confirma a senha usando o próprio Better Auth
    try {
      await auth.api.verifyPassword({
        body: { password: senha },
        headers: cabecalhos,
      });
    } catch {
      return Response.json(
        { mensagem: "Senha incorreta. Confira sua senha e tente novamente." },
        { status: 401 }
      );
    }

    const userId = sessao.user.id;

    await prisma.$transaction(async (tx) => {
      await tx.reviewHistory.deleteMany({
        where: { userId },
      });

      await tx.flashcard.deleteMany({
        where: {
          topic: {
            deck: { userId },
          },
        },
      });

      await tx.topic.deleteMany({
        where: {
          deck: { userId },
        },
      });

      await tx.deck.deleteMany({
        where: { userId },
      });

      await tx.studyGoal.deleteMany({
        where: { userId },
      });

      await tx.material.deleteMany({
        where: { userId },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return Response.json({
      mensagem: "Conta excluída com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);

    return Response.json(
      { mensagem: "Não foi possível excluir sua conta." },
      { status: 500 }
    );
  }
}
