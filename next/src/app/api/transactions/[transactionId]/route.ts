import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentMethod, Prisma, TxnType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAccountContext } from "@/lib/account";

const updateTransactionSchema = z.object({
  categoryId: z.string().optional(),
  type: z.nativeEnum(TxnType).optional(),
  amount: z.coerce.number().positive().optional(),
  occurredAt: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  note: z.string().max(500).nullable().optional(),
  merchant: z.string().max(120).nullable().optional(),
  counterparty: z.string().max(120).nullable().optional(),
  recurrenceGroupId: z.string().max(100).nullable().optional(),
  isFlagged: z.boolean().optional(),
  approvedById: z.string().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
});

const transactionInclude = {
  category: { select: { id: true, name: true, type: true, color: true, icon: true, archivedAt: true } },
  user: { select: { id: true, name: true, email: true } },
  approvedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TransactionInclude;

function serializeTransaction(transaction: Prisma.TransactionGetPayload<{ include: typeof transactionInclude }>) {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    category: transaction.category,
    user: transaction.user,
    approvedBy: transaction.approvedBy,
    approvedAt: transaction.approvedAt,
    type: transaction.type,
    amount: Number(transaction.amount),
    occurredAt: transaction.occurredAt,
    paymentMethod: transaction.paymentMethod,
    note: transaction.note,
    merchant: transaction.merchant,
    counterparty: transaction.counterparty,
    recurrenceGroupId: transaction.recurrenceGroupId,
    isFlagged: transaction.isFlagged,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}

export async function PATCH(request: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { accountId, userId } = await requireAccountContext();
    const body = await request.json();
    const parsed = updateTransactionSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Input tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: params.transactionId, accountId, deletedAt: null },
      include: transactionInclude,
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    const data: Prisma.TransactionUpdateInput = {};
    const input = parsed.data;

    if (input.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: input.categoryId, accountId },
      });

      if (!category) {
        return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
      }

      if (category.type !== (input.type ?? transaction.type)) {
        return NextResponse.json({ error: "Tipe kategori tidak sesuai" }, { status: 400 });
      }

      data.categoryId = category.id;
    }

    if (input.type && !input.categoryId) {
      if (input.type !== transaction.category.type) {
        return NextResponse.json({ error: "Kategori saat ini memiliki tipe berbeda" }, { status: 400 });
      }
      data.type = input.type;
    } else if (input.type) {
      data.type = input.type;
    }

    if (typeof input.amount === "number") {
      data.amount = new Prisma.Decimal(input.amount);
    }

    if (input.occurredAt) {
      data.occurredAt = new Date(input.occurredAt);
    }

    if (input.paymentMethod) {
      data.paymentMethod = input.paymentMethod;
    }

    if (input.note !== undefined) data.note = input.note ?? null;
    if (input.merchant !== undefined) data.merchant = input.merchant ?? null;
    if (input.counterparty !== undefined) data.counterparty = input.counterparty ?? null;
    if (input.recurrenceGroupId !== undefined) data.recurrenceGroupId = input.recurrenceGroupId ?? null;
    if (input.isFlagged !== undefined) data.isFlagged = input.isFlagged;

    if (input.approvedById !== undefined || input.approvedAt !== undefined) {
      if (input.approvedById) {
        const approver = await prisma.membership.findFirst({
          where: { accountId, userId: input.approvedById, status: "ACTIVE" },
          select: { role: true },
        });
        if (!approver) {
          return NextResponse.json({ error: "Approver tidak valid" }, { status: 400 });
        }
        data.approvedBy = { connect: { id: input.approvedById } };
      } else if (input.approvedById === null) {
        data.approvedBy = { disconnect: true };
      }

      if (input.approvedAt) {
        data.approvedAt = new Date(input.approvedAt);
      } else if (input.approvedAt === null) {
        data.approvedAt = null;
      }
    }

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: "Tidak ada perubahan" }, { status: 400 });
    }

    const updated = await prisma.transaction.update({
      where: { id: transaction.id },
      data,
      include: transactionInclude,
    });

    return NextResponse.json({ transaction: serializeTransaction(updated) });
  } catch (error) {
    console.error("Transactions PATCH error", error);
    return NextResponse.json({ error: "Gagal memperbarui transaksi" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { accountId } = await requireAccountContext();

    const transaction = await prisma.transaction.findFirst({
      where: { id: params.transactionId, accountId, deletedAt: null },
      select: { id: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transactions DELETE error", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi" }, { status: 500 });
  }
}
