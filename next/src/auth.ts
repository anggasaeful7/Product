import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import { AccountType, MembershipStatus, Plan } from "@prisma/client";

const credentialsSchema = z.object({
  email: z.string().email("Email wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Kredensial tidak valid");
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              where: { status: MembershipStatus.ACTIVE },
              orderBy: { createdAt: "asc" },
              take: 1,
              include: {
                account: {
                  include: {
                    subscription: true,
                  },
                },
              },
            },
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Email atau password salah");
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error("Email atau password salah");
        }

        const membership = user.memberships[0];
        const accountType = membership?.account.type ?? null;
        const plan =
          membership?.account.subscription?.plan ??
          (accountType === AccountType.ORG ? Plan.TEAM : Plan.FREE);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          defaultAccountId: membership?.accountId ?? null,
          accountType,
          plan,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.accountId = "defaultAccountId" in user ? user.defaultAccountId ?? null : null;
        token.accountType = "accountType" in user ? user.accountType ?? null : null;
        token.plan = "plan" in user ? user.plan ?? null : null;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.defaultAccountId = (token.accountId as string | null) ?? null;
        session.user.accountType = (token.accountType as typeof session.user.accountType) ?? null;
        session.user.plan = (token.plan as typeof session.user.plan) ?? null;
      }
      return session;
    },
  },
});
