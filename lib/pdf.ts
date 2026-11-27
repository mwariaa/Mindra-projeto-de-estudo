
import "server-only";
import { getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

PDFParse.setWorker(getData());

async function extrairResultadoPDF(arquivo: File) {
  const buffer = await arquivo.arrayBuffer();

  const parser = new PDFParse({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  try {
    return await parser.getText();
  } finally {
    await parser.destroy();
  }
}

export async function extrairTextoPDF(arquivo: File) {
  const resultado = await extrairResultadoPDF(arquivo);

  return resultado.text;
}

export async function extrairPaginasPDF(arquivo: File) {
  const resultado = await extrairResultadoPDF(arquivo);

  return resultado.pages.map((pagina) => ({
    pagina: pagina.num,
    texto: pagina.text,
  }));
}
