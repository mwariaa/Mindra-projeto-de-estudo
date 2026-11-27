
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
  "http://localhost:3000",
  "https://mindra-projeto-de-estudo.vercel.app",
  "https://mindra-projeto-de-estudo-*.vercel.app",
  "https://mindraapp.com.br",
  "https://www.mindraapp.com.br",
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      await enviarEmail({
        para: user.email,
        assunto: "Redefina sua senha - Mindra",
        mensagem: `
<div style="margin:0;padding:40px 16px;background-color:#F5F0ED;font-family:Arial,Helvetica,sans-serif;color:#202B4A;">
  <div style="max-width:520px;margin:0 auto;padding:40px 32px;background-color:#FFFFFF;border:1px solid #E8E5F0;border-radius:20px;text-align:center;">
    <p style="margin:0 0 12px;color:#7775A8;font-size:13px;font-weight:bold;letter-spacing:3px;">MINDRA</p>

    <h1 style="margin:0 0 20px;color:#202B4A;font-family:Georgia,serif;font-size:34px;font-weight:normal;">
      Uma nova senha, um novo começo.
    </h1>

    <p style="margin:0 0 16px;color:#555B70;font-size:15px;line-height:1.8;">
      Olá, ${user.name}!
    </p>

    <p style="margin:0 0 28px;color:#7775A8;font-size:15px;line-height:1.8;">
      Recebemos uma solicitação para redefinir sua senha na Mindra.
      Para criar uma nova senha e continuar sua jornada de aprendizado,
      clique no botão abaixo.
    </p>

    <a href="${url}" style="display:inline-block;padding:15px 30px;background-color:#7775A8;color:#FFFFFF;text-decoration:none;border-radius:10px;font-size:15px;font-weight:bold;">
      Redefinir minha senha
    </a>

    <p style="margin:28px 0 8px;color:#9995AD;font-size:12px;line-height:1.7;">
      Se você não solicitou a redefinição de senha,
      ignore esta mensagem. Sua senha permanecerá a mesma.
    </p>

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #EEEAF3;">
      <p style="margin:0;color:#AAA8B8;font-size:12px;">Aprenda. Lembre. Evolua.</p>
    </div>
  </div>
</div>
        `,
      });
    },

    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await enviarEmail({
        para: user.email,
        assunto: "Seu próximo passo começa aqui | Mindra",
        mensagem: `
<div style="margin:0;padding:40px 16px;background-color:#F5F0ED;font-family:Arial,Helvetica,sans-serif;color:#202B4A;">
  <div style="max-width:520px;margin:0 auto;padding:40px 32px;background-color:#FFFFFF;border:1px solid #E8E5F0;border-radius:20px;text-align:center;">
    <p style="margin:0 0 12px;color:#7775A8;font-size:13px;font-weight:bold;letter-spacing:3px;">MINDRA</p>

    <h1 style="margin:0 0 20px;color:#202B4A;font-family:Georgia,serif;font-size:34px;font-weight:normal;">
      Sua jornada começa agora.
    </h1>

    <p style="margin:0 0 16px;color:#555B70;font-size:15px;line-height:1.8;">
      Olá, ${user.name}!
    </p>

    <p style="margin:0 0 28px;color:#7775A8;font-size:15px;line-height:1.8;">
      Estamos felizes em ter você com a gente.
      Para começar a organizar seus estudos, confirmar seu
      aprendizado e acompanhar sua evolução, precisamos
      apenas que você confirme seu endereço de e-mail.
    </p>

    <a href="${url}" style="display:inline-block;padding:15px 30px;background-color:#7775A8;color:#FFFFFF;text-decoration:none;border-radius:10px;font-size:15px;font-weight:bold;">
      Confirmar meu e-mail
    </a>

    <p style="margin:28px 0 8px;color:#9995AD;font-size:12px;line-height:1.7;">
      Se você não criou uma conta na Mindra, pode ignorar
      esta mensagem.
    </p>

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #EEEAF3;">
      <p style="margin:0;color:#AAA8B8;font-size:12px;">Aprenda. Lembre. Evolua.</p>
    </div>
  </div>
</div>
        `,
      });
    },

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
});
