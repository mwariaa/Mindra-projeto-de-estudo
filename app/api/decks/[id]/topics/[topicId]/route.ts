
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

    const conteudo = await prisma.topic.findFirst({
      where: { id, deck: { userId: sessao.user.id } },
    });

    if (!conteudo) {
      return Response.json({ erro: "Conteúdo não encontrado." }, { status: 404 });
    }

    const atualizado = await prisma.topic.update({
      where: { id },
      data: { name },
    });

    return Response.json({ mensagem: "Conteúdo atualizado!", topic: atualizado });
  } catch (error) {
    console.error("Erro ao editar conteúdo:", error);
    return Response.json({ erro: "Não foi possível editar o conteúdo." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  try {
    const sessao = await auth.api.getSession({ headers: request.headers });
    if (!sessao) {
      return Response.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { id } = await params;
    const conteudo = await prisma.topic.findFirst({
      where: { id, deck: { userId: sessao.user.id } },
    });

    if (!conteudo) {
      return Response.json({ erro: "Conteúdo não encontrado." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.reviewHistory.deleteMany({ where: { topicId: id } });
      await tx.flashcard.deleteMany({ where: { topicId: id } });
      await tx.topic.delete({ where: { id } });
    });

    return Response.json({ mensagem: "Conteúdo excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir conteúdo:", error);
    return Response.json({ erro: "Não foi possível excluir o conteúdo." }, { status: 500 });
  }
}
