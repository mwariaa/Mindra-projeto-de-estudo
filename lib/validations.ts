import { z } from "zod";

export const usuarioSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),

  email: z.email("E-mail inválido"),

  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});
export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});