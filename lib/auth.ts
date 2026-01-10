import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
// Using the custom generated Prisma client path
import { PrismaClient } from "./generated/prisma";
import { env } from "./env";

// Initializing the prisma client for github using better auth
const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_ID || "",
      clientSecret: env.AUTH_GITHUB_SECRET || "",
    },
  },

  // this is resend email OTP plugin configuration useing betterauth

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "LMS Platform <onboarding@resend.dev>",
          to: [email],
          subject: "this is the verification OTP",
          html: `<strong>OTP: ${otp}</strong>`,
        });
      },
    }),
    admin(),
  ],
});
