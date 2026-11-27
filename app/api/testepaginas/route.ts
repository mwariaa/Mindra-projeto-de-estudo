import { extrairPaginasPDF } from "@/lib/pdf";

export async function POST(request: Request) {
  const dados = await request.formData();
  const arquivo = dados.get("arquivo");

  if (!(arquivo instanceof File)) {
    return Response.json(
      { erro: "Nenhum arquivo foi enviado." },
      { status: 400 }
    );
  }

  if (arquivo.type !== "application/pdf") {
    return Response.json(
      { erro: "O arquivo precisa ser um PDF." },
      { status: 400 }
    );
  }

  const paginas = await extrairPaginasPDF(arquivo);

  return Response.json({
    totalPaginas: paginas.length,
    paginas,
  });
}