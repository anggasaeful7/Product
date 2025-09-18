import { NextResponse } from "next/server";
import { z } from "zod";
import { TxnType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAccountContext } from "@/lib/account";

const createCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  type: z.nativeEnum(TxnType),
  color: z.string().max(20).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  order: z.number().int().min(0).nullable().optional(),
});

export async function GET(request: Request) {
  try {
    const { accountId } = await requireAccountContext();
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    const categories = await prisma.category.findMany({
      where: {
        accountId,
        ...(includeArchived ? {} : { archivedAt: null }),
      },
      orderBy: [
        { type: "asc" },
        { order: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories GET error", error);
    return NextResponse.json({ error: "Gagal mengambil kategori" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { accountId } = await requireAccountContext();
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Input tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, type, color, icon, order } = parsed.data;

    const exists = await prisma.category.findFirst({
      where: { accountId, name, archivedAt: null },
    });

    if (exists) {
      return NextResponse.json({ error: "Nama kategori sudah digunakan" }, { status: 400 });
    }

    const nextOrder = order ?? (await prisma.category.count({ where: { accountId, type } }));

    const category = await prisma.category.create({
      data: {
        accountId,
        name,
        type,
        color: color ?? null,
        icon: icon ?? null,
        order: nextOrder,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Categories POST error", error);
    return NextResponse.json({ error: "Gagal menambah kategori" }, { status: 500 });
  }
}
