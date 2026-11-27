import "server-only";

import { prisma } from "@/lib/prisma";
import type { Chunk } from "@/lib/chunking";

export async function salvarChunks(
  materialId: string,
  chunks: Chunk[]
) {
  return prisma.materialChunk.createMany({
    data: chunks.map((chunk) => ({
      texto: chunk.texto,
      paginaInicial: chunk.paginaInicial,
      paginaFinal: chunk.paginaFinal,
      materialId,
    })),
  });
}