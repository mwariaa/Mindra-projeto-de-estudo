
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export async function GET(request: Request) {
  await connection();

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

    const decks = await prisma.deck.findMany({
      where: {
        userId: sessao.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        topics: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            reviewHistory: {
              where: {
                userId: sessao.user.id,
              },
              orderBy: [
                { reviewDate: "desc" },
                { id: "desc" },
              ],
            },
            _count: {
              select: {
                flashcards: true,
              },
            },
          },
        },
      },
    });

    const materias = decks.map((deck) => {
      const conteudos = deck.topics.map((topic) => {
        const ultimaAvaliacao = topic.reviewHistory[0] ?? null;

        return {
          id: topic.id,
          nome: topic.name,
          classificacaoAtual: ultimaAvaliacao?.rating ?? null,
          ultimaAvaliacao: ultimaAvaliacao?.reviewDate ?? null,
          totalAvaliacoes: topic.reviewHistory.length,
          totalFlashcards: topic._count.flashcards,
        };
      });

      return {
        id: deck.id,
        nome: deck.name,
        totalConteudos: conteudos.length,
        conteudos,
      };
    });

    const todosConteudos = materias.flatMap(
      (materia) => materia.conteudos
    );

    const resumo = {
      totalMaterias: materias.length,
      totalConteudos: todosConteudos.length,
      totalFlashcards: todosConteudos.reduce(
        (total, conteudo) => total + conteudo.totalFlashcards,
        0
      ),
      aprofundar: todosConteudos.filter(
        (conteudo) => conteudo.classificacaoAtual === "APROFUNDAR"
      ).length,
      revisar: todosConteudos.filter(
        (conteudo) => conteudo.classificacaoAtual === "REVISAR"
      ).length,
      dominando: todosConteudos.filter(
        (conteudo) => conteudo.classificacaoAtual === "DOMINANDO"
      ).length,
      semAvaliacao: todosConteudos.filter(
        (conteudo) => conteudo.classificacaoAtual === null
      ).length,
    };

    return Response.json({
      mensagem: "Dashboard encontrado com sucesso!",
      resumo,
      materias,
    });
  } catch (erro) {
    console.error("Erro ao buscar dashboard:", erro);

    return Response.json(
      { erro: "Não foi possível carregar o dashboard." },
      { status: 500 }
    );
  }
}
