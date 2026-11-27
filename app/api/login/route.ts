
import { loginSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validacao = loginSchema.safeParse(body);

    if (!validacao.success) {
      return Response.json({
        mensagem: "Dados inválidos.",
        erros: validacao.error.issues,
      }, { status: 400 });
    }

    const { email, password } = validacao.data;

    const usuario = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!usuario || !usuario.passwordHash) {
      return Response.json({
        mensagem: "E-mail ou senha incorretos.",
      }, { status: 401 });
    }

    const senhaCorreta = await bcrypt.compare(
      password,
      usuario.passwordHash
    );

    if (!senhaCorreta) {
      return Response.json({
        mensagem: "E-mail ou senha incorretos.",
      }, { status: 401 });
    }

    return Response.json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Erro no login:", error);

    return Response.json({
      mensagem: "Erro interno ao realizar login.",
    }, { status: 500 });
  }
}
