import { NextResponse } from "next/server";
import { z } from "zod";
import { TxnType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAccountContext } from "@/lib/account";

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().max(20).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  type: z.nativeEnum(TxnType).optional(),
  order: z.number().int().min(0).nullable().optional(),
  archived: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const { accountId } = await requireAccountContext();
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Input tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const category = await prisma.category.findFirst({
      where: { id: params.categoryId, accountId },
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    const { name, color, icon, type, order, archived } = parsed.data;

    if (typeof name === "string") data.name = name.trim();
    if (parsed.data.color !== undefined) data.color = color ?? null;
    if (parsed.data.icon !== undefined) data.icon = icon ?? null;
    if (parsed.data.order !== undefined) data.order = order ?? 0;

    if (typeof archived === "boolean") {
      data.archivedAt = archived ? new Date() : null;
    }

    if (type && type !== category.type) {
      const txCount = await prisma.transaction.count({
        where: { categoryId: category.id, deletedAt: null },
      });

      if (txCount > 0) {
        return NextResponse.json({ error: "Tidak dapat mengubah tipe kategori karena sudah digunakan." }, { status: 400 });
      }

      data.type = type;
    }

    const updated = await prisma.category.update({
      where: { id: category.id },
      data,
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Categories PATCH error", error);
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const { accountId } = await requireAccountContext();

    const category = await prisma.category.findFirst({
      where: { id: params.categoryId, accountId },
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    await prisma.category.update({
      where: { id: category.id },
      data: { archivedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Categories DELETE error", error);
    return NextResponse.json({ error: "Gagal mengarsipkan kategori" }, { status: 500 });
  }
}
