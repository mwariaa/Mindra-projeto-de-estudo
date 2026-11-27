import { usuarioSchema } from "@/lib/validations";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validacao = usuarioSchema.safeParse(body);
    if (!validacao.success) {
      return Response.json({
      mensagem: "Dados inválidos.",
      erros: validacao.error.issues,
      }, { status: 400 });
    }
    const { name, email, password } = validacao.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return Response.json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
      },
    }, { status: 201 });

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json({
        mensagem: "Este e-mail já está cadastrado.",
      }, { status: 409 });
    }

    return Response.json({
      mensagem: "Erro interno ao cadastrar usuário.",
    }, { status: 500 });
  }
}