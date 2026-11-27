
import "server-only";

const API_BASE = "https://api.cloudflare.com/client/v4";

function obterConfiguracao() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const nomeIndice = process.env.CLOUDFLARE_VECTORIZE_INDEX;

  if (!accountId || !apiToken || !nomeIndice) {
    throw new Error(
      "Configurações do Cloudflare Vectorize não encontradas."
    );
  }

  return { accountId, apiToken, nomeIndice };
}

interface VetorDocumento {
  id: string;
  valores: number[];
  materialId: string;
  texto: string;
  paginaInicial: number;
  paginaFinal: number;
}

export async function inserirVetores(
  vetores: VetorDocumento[]
) {
  const { accountId, apiToken, nomeIndice } =
    obterConfiguracao();

  const resposta = await fetch(
    `${API_BASE}/accounts/${accountId}/vectorize/v2/indexes/${nomeIndice}/upsert`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vectors: vetores.map((vetor) => ({
          id: vetor.id,
          values: vetor.valores,
          metadata: {
            materialId: vetor.materialId,
            texto: vetor.texto,
            paginaInicial: vetor.paginaInicial,
            paginaFinal: vetor.paginaFinal,
          },
        })),
      }),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok || !resultado.success) {
    throw new Error(
      `Erro ao inserir vetores: ${JSON.stringify(resultado.errors)}`
    );
  }

  return resultado.result;
}

export async function buscarVetores(
  embedding: number[],
  materialId: string,
  quantidade: number = 5
) {
  const { accountId, apiToken, nomeIndice } =
    obterConfiguracao();

  const resposta = await fetch(
    `${API_BASE}/accounts/${accountId}/vectorize/v2/indexes/${nomeIndice}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vector: embedding,
        topK: quantidade,
        filter: {
         materialId: {
         $eq: materialId,
         },
        },
        returnMetadata: "all",
        returnValues: false,
      }),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok || !resultado.success) {
    throw new Error(
      `Erro ao buscar vetores: ${JSON.stringify(resultado.errors)}`
    );
  }

  return resultado.result.matches;
}
