import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentMethod, Prisma, TxnType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAccountContext } from "@/lib/account";

const transactionQuerySchema = z.object({
  search: z.string().max(100).optional(),
  type: z.nativeEnum(TxnType).optional(),
  categoryId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  recurringOnly: z.coerce.boolean().optional(),
});

const createTransactionSchema = z.object({
  categoryId: z.string().min(1),
  type: z.nativeEnum(TxnType),
  amount: z.coerce.number().positive(),
  occurredAt: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod),
  note: z.string().max(500).optional(),
  merchant: z.string().max(120).optional(),
  counterparty: z.string().max(120).optional(),
  recurrenceGroupId: z.string().max(100).nullable().optional(),
});

const updateTransactionSchema = createTransactionSchema.partial();

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

export async function GET(request: Request) {
  try {
    const { accountId } = await requireAccountContext();
    const { searchParams } = new URL(request.url);
    const parsed = transactionQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Parameter tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const {
      search,
      type,
      categoryId,
      userId,
      startDate,
      endDate,
      cursor,
      limit = 20,
      recurringOnly,
    } = parsed.data;

    const where: Prisma.TransactionWhereInput = {
      accountId,
      deletedAt: null,
      ...(type ? { type } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(userId ? { userId } : {}),
      ...(recurringOnly ? { recurrenceGroupId: { not: null } } : {}),
    };

    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) {
        where.occurredAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.valueOf())) {
          end.setHours(23, 59, 59, 999);
          where.occurredAt.lte = end;
        }
      }
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
        { merchant: { contains: search, mode: "insensitive" } },
        { counterparty: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = limit + 1;
    const transactions = await prisma.transaction.findMany({
      where,
      include: transactionInclude,
      orderBy: [
        { occurredAt: "desc" },
        { id: "desc" },
      ],
      take,
      ...(cursor ? { cursor: { id: cursor } } : {}),
      ...(cursor ? { skip: 1 } : {}),
    });

    let nextCursor: string | null = null;
    let items = transactions;

    if (transactions.length > limit) {
      const next = transactions.pop();
      nextCursor = next?.id ?? null;
      items = transactions;
    }

    const serialized = items.map(serializeTransaction);

    const grouped = await prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: { amount: true },
    });

    const income = Number(grouped.find((item) => item.type === "INCOME")?._sum.amount ?? 0);
    const expense = Number(grouped.find((item) => item.type === "EXPENSE")?._sum.amount ?? 0);

    const recurringCount = await prisma.transaction.count({
      where: {
        ...where,
        recurrenceGroupId: { not: null },
      },
    });

    const flaggedCount = await prisma.transaction.count({
      where: {
        ...where,
        isFlagged: true,
      },
    });

    return NextResponse.json({
      transactions: serialized,
      nextCursor,
      summary: {
        income,
        expense,
        net: income - expense,
        recurringCount,
        flaggedCount,
      },
    });
  } catch (error) {
    console.error("Transactions GET error", error);
    return NextResponse.json({ error: "Gagal mengambil transaksi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { accountId, userId } = await requireAccountContext();
    const body = await request.json();
    const parsed = createTransactionSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Input tidak valid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, accountId },
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    if (category.archivedAt) {
      return NextResponse.json({ error: "Kategori sudah diarsipkan" }, { status: 400 });
    }

    if (category.type !== data.type) {
      return NextResponse.json({ error: "Tipe kategori tidak sesuai" }, { status: 400 });
    }

    const created = await prisma.transaction.create({
      data: {
        accountId,
        categoryId: data.categoryId,
        userId,
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        occurredAt: new Date(data.occurredAt),
        paymentMethod: data.paymentMethod,
        note: data.note ?? null,
        merchant: data.merchant ?? null,
        counterparty: data.counterparty ?? null,
        recurrenceGroupId: data.recurrenceGroupId ?? null,
      },
      include: transactionInclude,
    });

    return NextResponse.json({ transaction: serializeTransaction(created) }, { status: 201 });
  } catch (error) {
    console.error("Transactions POST error", error);
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }
}
