import { criarChunks } from "./chunking";
const paginas = [
  {
    pagina: 1,
    texto: Array.from(
      { length: 500 },
      (_, i) => `pagina1_palavra${i + 1}`
    ).join(" "),
  },
  {
    pagina: 2,
    texto: Array.from(
      { length: 500 },
      (_, i) => `pagina2_palavra${i + 1}`
    ).join(" "),
  },
  {
    pagina: 3,
    texto: Array.from(
      { length: 500 },
      (_, i) => `pagina3_palavra${i + 1}`
    ).join(" "),
  },
];
const resultado = criarChunks(paginas);

console.log(
  resultado.map((chunk) => ({
    id: chunk.id,
    quantidadePalavras: chunk.texto.split(/\s+/).filter(Boolean).length,
    paginaInicial: chunk.paginaInicial,
    paginaFinal: chunk.paginaFinal,
    contemPagina1: chunk.texto.includes("pagina1_"),
    contemPagina2: chunk.texto.includes("pagina2_"),
    contemPagina3: chunk.texto.includes("pagina3_"),
  }))
);