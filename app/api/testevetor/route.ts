
import { gerarEmbeddingDocumento } from "@/lib/embeddings";
import { inserirVetores } from "@/lib/vectorize";
import { buscarVetores } from "@/lib/vectorize";

export async function GET() {
  try {
    const texto =
      "O Direito Constitucional estuda a Constituição e os direitos fundamentais.";

    const embedding = await gerarEmbeddingDocumento(texto);

    const resultado = await inserirVetores([
      {
        id: "teste-direito-001",
        materialId: "material-teste-001",
        valores: embedding,
        texto,
        paginaInicial: 1,
        paginaFinal: 1,
      },
    ]);
    const pergunta = "O que são direitos fundamentais?";

    const embeddingPergunta =
      await gerarEmbeddingDocumento(pergunta);

const encontrados = await buscarVetores(
  embeddingPergunta,
  "material-teste-001",
  5
);


const encontradosNovamente = await buscarVetores(
  embeddingPergunta,
  "material-teste-001",
  5
);;
    return Response.json({
      sucesso: true,
      mensagem: "Vetor inserido com sucesso!",
      resultado,
       pergunta,
       encontrados,
    });
  } catch (erro) {
    console.error("Erro no teste do Vectorize:", erro);

    return Response.json(
      { sucesso: false, erro: "Falha ao inserir vetor." },
      { status: 500 }
    );
  }
}
