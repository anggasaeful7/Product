import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { AccountType, Plan, Role, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  accountType: z.nativeEnum(AccountType),
  organizationName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Input tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, password, accountType, organizationName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    const accountName = (() => {
      if (accountType === AccountType.ORG) {
        if (organizationName && organizationName.trim().length >= 2) {
          return organizationName.trim();
        }
        return `${name}'s Team`;
      }
      const firstName = name.split(" ")[0];
      return `${firstName}'s Personal Finance`;
    })();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          isVerified: true,
        },
      });

      const account = await tx.account.create({
        data: {
          name: accountName,
          ownerId: user.id,
          type: accountType,
        },
      });

      await tx.membership.create({
        data: {
          accountId: account.id,
          userId: user.id,
          role: Role.OWNER,
        },
      });

      return { userId: user.id };
    });

    return NextResponse.json({ success: true, userId: result.userId });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}

