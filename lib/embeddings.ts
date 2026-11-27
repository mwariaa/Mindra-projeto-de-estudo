
import "server-only";

const MODELO_EMBEDDING = "@cf/google/embeddinggemma-2";

interface RespostaEmbedding {
  result: {
    data: {
      embedding: number[];
    }[];
  };
}

export async function gerarEmbeddingDocumento(
  texto: string
): Promise<number[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Credenciais da Cloudflare não configuradas.");
  }

  const resposta = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODELO_EMBEDDING}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [`title: none | text: ${texto}`],
      }),
    }
  );

  if (!resposta.ok) {
    throw new Error(
      `Erro ao gerar embedding: ${resposta.status}`
    );
  }

  const resultado = await resposta.json();


const dados = resultado as RespostaEmbedding;

const embedding = dados.result?.data?.[0]?.embedding;

if (!embedding || embedding.length !== 768) {
  throw new Error(
    "A Cloudflare retornou um embedding inválido."
  );
}

return embedding;
}
