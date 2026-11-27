
export interface Chunk {
  id: number;
  texto: string;
  paginaInicial: number;
  paginaFinal: number;
}

export interface Pagina {
  pagina: number;
  texto: string;
}

interface Paragrafo {
  texto: string;
  pagina: number;
}

const TAMANHO_MAXIMO = 800;
const SOBREPOSICAO = 77;
const TAMANHO_MAXIMO_PALAVRAS = 75;

function contarTokensEstimados(texto: string): number {
  const quantidadePalavras = texto
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.ceil(quantidadePalavras * 1.3);
}

function obterSobreposicao(
  paragrafos: Paragrafo[]
): Paragrafo[] {
  const resultado: Paragrafo[] = [];

  let quantidadePalavras = 0;

  for (let i = paragrafos.length - 1; i >= 0; i--) {
    const paragrafo = paragrafos[i];

    const palavras = paragrafo.texto
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const faltam = SOBREPOSICAO - quantidadePalavras;

    if (faltam <= 0) {
      break;
    }

    const palavrasSelecionadas = palavras.slice(-faltam);

    resultado.unshift({
      texto: palavrasSelecionadas.join(" "),
      pagina: paragrafo.pagina,
    });

    quantidadePalavras += palavrasSelecionadas.length;

    if (quantidadePalavras >= SOBREPOSICAO) {
      break;
    }
  }

  return resultado;
}

function dividirParagrafo(
  texto: string,
  pagina: number
): Paragrafo[] {
  const palavras = texto.trim().split(/\s+/);

  const partes: Paragrafo[] = [];

  for (
    let i = 0;
    i < palavras.length;
    i += TAMANHO_MAXIMO_PALAVRAS
  ) {
    const textoParte = palavras
      .slice(i, i + TAMANHO_MAXIMO_PALAVRAS)
      .join(" ");

    partes.push({
      texto: textoParte,
      pagina,
    });
  }

  return partes;
}

export function criarChunks(paginas: Pagina[]): Chunk[] {
  const chunks: Chunk[] = [];

  let paragrafosAtuais: Paragrafo[] = [];

  let id = 1;

  for (const pagina of paginas) {
    const paragrafos = pagina.texto
      .split(/\n+/)
      .map((paragrafo) => paragrafo.trim())
      .filter((paragrafo) => paragrafo.length > 0);

    for (const paragrafo of paragrafos) {
      const partesDoParagrafo = dividirParagrafo(
        paragrafo,
        pagina.pagina
      );

      for (const parte of partesDoParagrafo) {
        const textoAtual = paragrafosAtuais
          .map((item) => item.texto)
          .join("\n\n");

        const textoPossivel = textoAtual
          ? `${textoAtual}\n\n${parte.texto}`
          : parte.texto;

        const tokensPossiveis =
          contarTokensEstimados(textoPossivel);

        if (
          tokensPossiveis > TAMANHO_MAXIMO &&
          paragrafosAtuais.length > 0
        ) {
          chunks.push({
            id,
            texto: textoAtual.trim(),
            paginaInicial: paragrafosAtuais[0].pagina,
            paginaFinal:
              paragrafosAtuais[paragrafosAtuais.length - 1].pagina,
          });

          id++;

          paragrafosAtuais = obterSobreposicao(
            paragrafosAtuais
          );
        }

        paragrafosAtuais.push(parte);
      }
    }
  }

  if (paragrafosAtuais.length > 0) {
    const textoFinal = paragrafosAtuais
      .map((item) => item.texto)
      .join("\n\n");

    chunks.push({
      id,
      texto: textoFinal.trim(),
      paginaInicial: paragrafosAtuais[0].pagina,
      paginaFinal:
        paragrafosAtuais[paragrafosAtuais.length - 1].pagina,
    });
  }

  return chunks;
}
