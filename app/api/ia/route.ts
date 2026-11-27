
import { groq } from "@/lib/groq";
import { extrairPaginasPDF } from "@/lib/pdf";
import { auth } from "@/lib/auth";
import { criarChunks } from "@/lib/chunking";
import { salvarChunks } from "@/lib/material-chunks";
import { prisma } from "@/lib/prisma";
import { gerarEmbeddingDocumento } from "@/lib/embeddings";
import { inserirVetores } from "@/lib/vectorize";

export async function POST(request: Request) {
  const sessao = await auth.api.getSession({
    headers: request.headers,
  });

  if (!sessao) {
    return Response.json(
      { erro: "Você precisa estar autenticado." },
      { status: 401 }
    );
  }

  const dados = await request.formData();
  const arquivo = dados.get("arquivo");

  // Verifica se um arquivo foi enviado
  if (!(arquivo instanceof File)) {
    return Response.json(
      { erro: "Nenhum arquivo foi enviado." },
      { status: 400 }
    );
  }

  // Verifica se o arquivo é um PDF
  if (arquivo.type !== "application/pdf") {
    return Response.json(
      { erro: "O arquivo precisa estar no formato PDF." },
      { status: 400 }
    );
  }

  // Extrai o texto do PDF e cria os chunks
  const paginas = await extrairPaginasPDF(arquivo);
  const chunks = criarChunks(paginas);

  // Verifica se existem chunks
  if (chunks.length === 0) {
    return Response.json(
      { erro: "Não foi possível extrair texto do PDF." },
      { status: 400 }
    );
  }

  // Cria o material no banco de dados
  const material = await prisma.material.create({
    data: {
      name: arquivo.name,
      fileType: arquivo.type,
      fileSize: arquivo.size,
      userId: sessao.user.id,
    },
  });

  // Salva os chunks no PostgreSQL
  await salvarChunks(material.id, chunks);

  // Gera os embeddings
  const vetores = [];

  for (const chunk of chunks) {
    const embedding = await gerarEmbeddingDocumento(chunk.texto);

    vetores.push({
      id: `${material.id}-${chunk.id}`,
      valores: embedding,
      materialId: material.id,
      texto: chunk.texto,
      paginaInicial: chunk.paginaInicial,
      paginaFinal: chunk.paginaFinal,
    });
  }

  // Armazena os vetores no Cloudflare Vectorize
  await inserirVetores(vetores);

  // Envia o conteúdo para a IA
  const resposta = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          Retorne sua resposta exclusivamente em JSON válido,
          sem markdown ou blocos de código.

          Utilize exatamente esta estrutura:
          {
            "flashcards": [
              {
                "pergunta": "Pergunta do flashcard",
                "resposta": "Resposta do flashcard"
              }
            ]
          }
        `,
      },
      {
        role: "user",
        content: `
          Você é um assistente especializado em criar flashcards para estudantes.

          Analise o conteúdo abaixo e crie flashcards com perguntas objetivas e respostas claras.

          Regras:
          - Utilize somente informações presentes no material.
          - Priorize conceitos importantes.
          - Evite perguntas repetidas.
          - Não invente informações.
          - Crie entre 5 e 20 flashcards, conforme a quantidade de conteúdo.
          - Escreva em português brasileiro.

          Material:
          ${chunks.map((chunk) => chunk.texto).join("\n\n")}
        `,
      },
    ],
    model: "openai/gpt-oss-120b",
  });

  // Obtém a resposta da IA
  const conteudo = resposta.choices[0]?.message?.content;

  if (!conteudo) {
    return Response.json(
      { erro: "A IA não retornou nenhum flashcard." },
      { status: 500 }
    );
  }

  // Converte a resposta para JSON
  let flashcards;

  try {
    flashcards = JSON.parse(conteudo);
  } catch {
    return Response.json(
      { erro: "A IA retornou uma resposta em formato inválido." },
      { status: 500 }
    );
  }

  // Verifica se existe uma lista de flashcards
  if (
    !flashcards.flashcards ||
    !Array.isArray(flashcards.flashcards) ||
    flashcards.flashcards.length === 0
  ) {
    return Response.json(
      { erro: "A IA não retornou uma lista válida de flashcards." },
      { status: 500 }
    );
  }

  // Verifica se todos os cartões possuem pergunta e resposta
  const flashcardsValidos = flashcards.flashcards.every(
    (card: any) =>
      typeof card.pergunta === "string" &&
      card.pergunta.trim() !== "" &&
      typeof card.resposta === "string" &&
      card.resposta.trim() !== ""
  );

  if (!flashcardsValidos) {
    return Response.json(
      { erro: "Um ou mais flashcards possuem dados inválidos." },
      { status: 500 }
    );
  }

  return Response.json({
  materialId: material.id,
  flashcards: flashcards.flashcards,
  });
}
