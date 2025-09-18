import {
  PrismaClient,
  Prisma,
  AccountType,
  Plan,
  Role,
  SubscriptionStatus,
  TxnType,
  PaymentMethod,
  BudgetPeriod,
  NotificationType,
  NotificationChannel,
  NotificationPriority,
  InsightTone,
  ReportTrend,
  AttachmentPurpose,
  StorageBucket,
  AIMessageRole,
  Provider,
  ReportDeliveryChannel
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

type CategorySeed = {
  name: string;
  type: TxnType;
  color: string;
  icon: string;
};

type TagSeed = {
  name: string;
  color: string;
};

type AttachmentSeed = {
  path: string;
  size: number;
  mime: string;
  checksum: string;
  purpose?: AttachmentPurpose;
  bucket?: StorageBucket;
  isSafe?: boolean;
  scannedAt?: Date | null;
};

type TransactionSeed = {
  category: string;
  type: TxnType;
  amount: number;
  occurredAt: Date;
  note?: string;
  paymentMethod: PaymentMethod;
  merchant?: string;
  counterparty?: string;
  recurrenceGroupId?: string;
  tagNames?: string[];
  tagAssigneeId?: string;
  approvedById?: string;
  approvedAt?: Date;
  isFlagged?: boolean;
  attachments?: AttachmentSeed[];
};

async function createTransaction(
  accountId: string,
  userId: string,
  categoryMap: Map<string, { id: string }> ,
  tagMap: Map<string, { id: string }> ,
  seed: TransactionSeed
) {
  const category = categoryMap.get(seed.category);
  if (!category) {
    throw new Error(`Unknown category "${seed.category}" for account ${accountId}`);
  }

  const transaction = await prisma.transaction.create({
    data: {
      accountId,
      categoryId: category.id,
      userId,
      type: seed.type,
      amount: seed.amount,
      currency: "IDR",
      occurredAt: seed.occurredAt,
      note: seed.note,
      paymentMethod: seed.paymentMethod,
      merchant: seed.merchant,
      counterparty: seed.counterparty,
      recurrenceGroupId: seed.recurrenceGroupId,
      approvedById: seed.approvedById,
      approvedAt: seed.approvedAt,
      isFlagged: seed.isFlagged ?? false,
    },
  });

  if (seed.tagNames?.length) {
    for (const tagName of seed.tagNames) {
      const tag = tagMap.get(tagName);
      if (!tag) continue;
      await prisma.transactionTag.create({
        data: {
          transactionId: transaction.id,
          tagId: tag.id,
          assignedById: seed.tagAssigneeId ?? userId,
        },
      });
    }
  }

  if (seed.attachments?.length) {
    for (const attachment of seed.attachments) {
      await prisma.attachment.create({
        data: {
          accountId,
          transactionId: transaction.id,
          bucket: attachment.bucket ?? StorageBucket.attachments,
          purpose: attachment.purpose ?? AttachmentPurpose.TRANSACTION,
          path: attachment.path,
          size: attachment.size,
          mime: attachment.mime,
          checksum: attachment.checksum,
          isSafe: attachment.isSafe ?? true,
          scannedAt: attachment.scannedAt ?? null,
        },
      });
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { attachmentsCount: seed.attachments.length },
    });
  }

  return transaction;
}

async function createCategories(accountId: string, seeds: CategorySeed[]) {
  const map = new Map<string, { id: string }>();
  for (const seed of seeds) {
    const category = await prisma.category.create({
      data: {
        accountId,
        name: seed.name,
        type: seed.type,
        color: seed.color,
        icon: seed.icon,
      },
    });
    map.set(category.name, { id: category.id });
  }
  return map;
}

async function createTags(accountId: string, seeds: TagSeed[]) {
  const map = new Map<string, { id: string }>();
  for (const seed of seeds) {
    const tag = await prisma.tag.create({
      data: {
        accountId,
        name: seed.name,
        color: seed.color,
      },
    });
    map.set(tag.name, { id: tag.id });
  }
  return map;
}

async function main() {
  console.log("Resetting existing data...");
  await prisma.$transaction([
    prisma.aIMessage.deleteMany(),
    prisma.aIConversation.deleteMany(),
    prisma.aIUsage.deleteMany(),
    prisma.reportHighlight.deleteMany(),
    prisma.reportKPI.deleteMany(),
    prisma.reportInsight.deleteMany(),
    prisma.monthlyReport.deleteMany(),
    prisma.budget.deleteMany(),
    prisma.transactionTag.deleteMany(),
    prisma.attachment.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("Creating users...");
  const passwordHash = await hash("demo1234", 10);

  const [personalUser, orgOwner, orgAdmin, orgMember] = await Promise.all([
    prisma.user.create({
      data: {
        email: "personal@example.com",
        passwordHash,
        name: "Personal User",
        locale: "id",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "owner@org.com",
        passwordHash,
        name: "Org Owner",
        locale: "id",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@org.com",
        passwordHash,
        name: "Org Admin",
        locale: "en",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "member@org.com",
        passwordHash,
        name: "Org Member",
        locale: "id",
        isVerified: true,
      },
    }),
  ]);

  console.log("Creating accounts & subscriptions...");
  const personalAccount = await prisma.account.create({
    data: {
      id: "seed-personal",
      name: "Personal Finance",
      currency: "IDR",
      type: AccountType.PERSONAL,
      ownerId: personalUser.id,
      subscription: {
        create: {
          plan: Plan.FREE,
          status: SubscriptionStatus.ACTIVE,
          customerId: "cus_seed_personal",
          lastInvoiceAt: daysAgo(5),
        },
      },
    },
  });

  const orgAccount = await prisma.account.create({
    data: {
      id: "seed-org",
      name: "AngsFlow Demo Org",
      currency: "IDR",
      type: AccountType.ORG,
      ownerId: orgOwner.id,
      subscription: {
        create: {
          plan: Plan.TEAM,
          status: SubscriptionStatus.ACTIVE,
          provider: Provider.STRIPE,
          customerId: "cus_seed_org",
          trialEndsAt: daysFromNow(7),
          lastInvoiceAt: daysAgo(2),
        },
      },
    },
  });

  console.log("Creating memberships & invitation...");
  const personalOwnerMembership = await prisma.membership.create({
    data: {
      accountId: personalAccount.id,
      userId: personalUser.id,
      role: Role.OWNER,
      lastAccessAt: new Date(),
    },
  });

  const orgOwnerMembership = await prisma.membership.create({
    data: {
      accountId: orgAccount.id,
      userId: orgOwner.id,
      role: Role.OWNER,
      lastAccessAt: new Date(),
    },
  });

  const orgAdminMembership = await prisma.membership.create({
    data: {
      accountId: orgAccount.id,
      userId: orgAdmin.id,
      role: Role.ADMIN,
      lastAccessAt: daysAgo(1),
    },
  });

  await prisma.membership.create({
    data: {
      accountId: orgAccount.id,
      userId: orgMember.id,
      role: Role.MEMBER,
      invitedEmail: "member@org.com",
      invitedAt: daysAgo(10),
      lastAccessAt: daysAgo(3),
    },
  });

  await prisma.invitation.create({
    data: {
      accountId: orgAccount.id,
      email: "pending@org.com",
      role: Role.MEMBER,
      inviterId: orgOwner.id,
      token: "seed-invite-token",
      expiresAt: daysFromNow(14),
    },
  });

  console.log("Creating categories & tags...");
  const personalCategoryMap = await createCategories(personalAccount.id, [
    { name: "Gaji", type: TxnType.INCOME, color: "#10b981", icon: "currency-dollar" },
    { name: "Proyek", type: TxnType.INCOME, color: "#3b82f6", icon: "briefcase" },
    { name: "Makanan", type: TxnType.EXPENSE, color: "#f97316", icon: "utensils" },
    { name: "Transport", type: TxnType.EXPENSE, color: "#6366f1", icon: "car" },
    { name: "Langganan", type: TxnType.EXPENSE, color: "#ec4899", icon: "refresh" },
  ]);

  const orgCategoryMap = await createCategories(orgAccount.id, [
    { name: "Client Revenue", type: TxnType.INCOME, color: "#059669", icon: "briefcase" },
    { name: "Partnership", type: TxnType.INCOME, color: "#0ea5e9", icon: "sparkles" },
    { name: "Operasional", type: TxnType.EXPENSE, color: "#f59e0b", icon: "cog" },
    { name: "Marketing", type: TxnType.EXPENSE, color: "#ef4444", icon: "megaphone" },
    { name: "Langganan", type: TxnType.EXPENSE, color: "#a855f7", icon: "refresh" },
  ]);

  const personalTagMap = await createTags(personalAccount.id, [
    { name: "Recurring", color: "#6366f1" },
    { name: "Needs", color: "#22c55e" },
    { name: "Lifestyle", color: "#f97316" },
  ]);

  const orgTagMap = await createTags(orgAccount.id, [
    { name: "Operational", color: "#0ea5e9" },
    { name: "Approval Required", color: "#f87171" },
    { name: "Growth", color: "#22c55e" },
    { name: "Recurring", color: "#6366f1" },
  ]);

  console.log("Creating budgets...");
  await prisma.budget.createMany({
    data: [
      {
        accountId: personalAccount.id,
        categoryId: personalCategoryMap.get("Makanan")!.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 3_500_000,
        period: BudgetPeriod.MONTHLY,
        carryOver: true,
        notes: "Termasuk makan siang kantor",
        alert80: true,
      },
      {
        accountId: personalAccount.id,
        categoryId: personalCategoryMap.get("Transport")!.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 1_200_000,
        period: BudgetPeriod.MONTHLY,
        notes: "Commuter line + ride hailing",
      },
      {
        accountId: orgAccount.id,
        categoryId: orgCategoryMap.get("Marketing")!.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 12_000_000,
        period: BudgetPeriod.MONTHLY,
        notes: "Campaign Q3",
        alert80: true,
        lockedAt: daysAgo(2),
      },
      {
        accountId: orgAccount.id,
        categoryId: orgCategoryMap.get("Operasional")!.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 6_000_000,
        period: BudgetPeriod.MONTHLY,
        carryOver: false,
      },
    ],
  });

  console.log("Creating transactions...");
  const personalTransactions: TransactionSeed[] = [
    {
      category: "Gaji",
      type: TxnType.INCOME,
      amount: 15_000_000,
      occurredAt: daysAgo(10),
      note: "Gaji Agustus",
      paymentMethod: PaymentMethod.TRANSFER,
      merchant: "PT Arunika Media",
      counterparty: "PT Arunika Media",
      recurrenceGroupId: "salary-personal",
      tagNames: ["Recurring"],
    },
    {
      category: "Proyek",
      type: TxnType.INCOME,
      amount: 3_500_000,
      occurredAt: daysAgo(18),
      note: "Freelance UI Project",
      paymentMethod: PaymentMethod.TRANSFER,
      merchant: "Client Ember",
      counterparty: "Client Ember",
      tagNames: ["Recurring"],
    },
    {
      category: "Makanan",
      type: TxnType.EXPENSE,
      amount: 320_000,
      occurredAt: daysAgo(7),
      note: "Dinner keluarga",
      paymentMethod: PaymentMethod.EWALLET,
      merchant: "GoFood",
      counterparty: "Restoran Sate Senayan",
      tagNames: ["Lifestyle"],
    },
    {
      category: "Transport",
      type: TxnType.EXPENSE,
      amount: 85_000,
      occurredAt: daysAgo(6),
      note: "Grab ke kantor",
      paymentMethod: PaymentMethod.EWALLET,
      merchant: "Grab Indonesia",
      counterparty: "Grab",
      tagNames: ["Needs"],
    },
    {
      category: "Langganan",
      type: TxnType.EXPENSE,
      amount: 65_000,
      occurredAt: daysAgo(4),
      note: "Spotify Premium",
      paymentMethod: PaymentMethod.CARD,
      merchant: "Spotify",
      counterparty: "Spotify",
      recurrenceGroupId: "spotify-personal",
      tagNames: ["Recurring"],
    },
    {
      category: "Makanan",
      type: TxnType.EXPENSE,
      amount: 450_000,
      occurredAt: daysAgo(2),
      note: "Belanja mingguan",
      paymentMethod: PaymentMethod.CARD,
      merchant: "Supermarket Hero",
      counterparty: "Hero Supermarket",
      tagNames: ["Needs"],
      attachments: [
        {
          path: "receipts/personal-groceries.pdf",
          size: 180_240,
          mime: "application/pdf",
          checksum: "checksum-personal-groceries",
        },
      ],
    },
  ];

  for (const seed of personalTransactions) {
    await createTransaction(personalAccount.id, personalUser.id, personalCategoryMap, personalTagMap, seed);
  }

  const orgTransactions: TransactionSeed[] = [
    {
      category: "Client Revenue",
      type: TxnType.INCOME,
      amount: 22_000_000,
      occurredAt: daysAgo(12),
      note: "Retainer PT Nusantara",
      paymentMethod: PaymentMethod.TRANSFER,
      merchant: "PT Nusantara Digital",
      counterparty: "PT Nusantara Digital",
      recurrenceGroupId: "retainer-org",
      tagNames: ["Recurring", "Growth"],
      tagAssigneeId: orgAdmin.id,
    },
    {
      category: "Marketing",
      type: TxnType.EXPENSE,
      amount: 5_500_000,
      occurredAt: daysAgo(9),
      note: "Meta Ads Campaign",
      paymentMethod: PaymentMethod.CARD,
      merchant: "Meta Ads",
      counterparty: "Meta Platforms",
      tagNames: ["Growth", "Approval Required"],
      tagAssigneeId: orgAdmin.id,
      approvedById: orgAdmin.id,
      approvedAt: daysAgo(8),
      attachments: [
        {
          path: "receipts/meta-ads.pdf",
          size: 240_512,
          mime: "application/pdf",
          checksum: "checksum-meta-ads",
        },
      ],
    },
    {
      category: "Operasional",
      type: TxnType.EXPENSE,
      amount: 2_200_000,
      occurredAt: daysAgo(5),
      note: "Office utilities",
      paymentMethod: PaymentMethod.TRANSFER,
      merchant: "PLN",
      counterparty: "PLN",
      tagNames: ["Operational"],
      tagAssigneeId: orgOwner.id,
      approvedById: orgOwner.id,
      approvedAt: daysAgo(5),
    },
    {
      category: "Langganan",
      type: TxnType.EXPENSE,
      amount: 1_250_000,
      occurredAt: daysAgo(3),
      note: "Figma Organization",
      paymentMethod: PaymentMethod.CARD,
      merchant: "Figma",
      counterparty: "Figma Inc",
      recurrenceGroupId: "figma-org",
      tagNames: ["Operational", "Recurring"],
      tagAssigneeId: orgAdmin.id,
    },
    {
      category: "Marketing",
      type: TxnType.EXPENSE,
      amount: 2_800_000,
      occurredAt: daysAgo(1),
      note: "Influencer collaboration",
      paymentMethod: PaymentMethod.EWALLET,
      merchant: "Tiktok Shop",
      counterparty: "Influencer XYZ",
      tagNames: ["Growth", "Approval Required"],
      tagAssigneeId: orgOwner.id,
      approvedById: orgOwner.id,
      approvedAt: daysAgo(1),
      isFlagged: true,
    },
  ];

  for (const seed of orgTransactions) {
    await createTransaction(orgAccount.id, orgOwner.id, orgCategoryMap, orgTagMap, seed);
  }

  console.log("Creating monthly reports...");
  const personalReportMetrics: Prisma.JsonObject = {
    totals: { income: 18_500_000, expense: 7_200_000, savingsRate: 0.61 },
    delta: { income: 0.12, expense: -0.04 },
  };
  const personalReport = await prisma.monthlyReport.create({
    data: {
      accountId: personalAccount.id,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      metrics: personalReportMetrics,
      summary: "Saldo bersih naik 12% dengan pengeluaran makanan masih tertinggi.",
      insights: {
        topExpenses: ["Makanan", "Langganan"],
        recommendation: "Batasi dine-out menjadi 2x per minggu.",
      } satisfies Prisma.JsonObject,
      sentAt: daysAgo(2),
      generatedByCron: true,
      aiSummaryId: "ai-summary-personal-001",
      highlights: {
        create: [
          { text: "Pendapatan tetap stabil selama 3 bulan", order: 0 },
          { text: "Pengeluaran transport turun 18%", order: 1 },
        ],
      },
      kpis: {
        create: [
          { label: "Saldo akhir", value: "Rp 76,5jt", delta: "+11%", trend: ReportTrend.UP, order: 0 },
          { label: "Cashflow", value: "+Rp 11,3jt", delta: "+3%", trend: ReportTrend.UP, order: 1 },
          { label: "Savings Rate", value: "61%", delta: "+6%", trend: ReportTrend.UP, order: 2 },
        ],
      },
      insightItems: {
        create: [
          {
            title: "Budget makan hampir penuh",
            description: "Sudah terpakai 82% dari batas bulan ini.",
            tone: InsightTone.WARNING,
            order: 0,
          },
          {
            title: "Langganan terkendali",
            description: "Total langganan tetap di bawah 10% dari income.",
            tone: InsightTone.POSITIVE,
            order: 1,
          },
        ],
      },
    },
  });

  const orgReportMetrics: Prisma.JsonObject = {
    totals: { income: 28_000_000, expense: 9_550_000 },
    runwayMonths: 9.5,
    teamEngagement: 0.78,
  };
  const orgReport = await prisma.monthlyReport.create({
    data: {
      accountId: orgAccount.id,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      metrics: orgReportMetrics,
      summary: "Marketing spend memberikan 18% uplift pada lead berkualitas.",
      insights: {
        aiCoach: "Fokuskan anggaran pada campaign retargeting karena ROI 3.4x.",
      } satisfies Prisma.JsonObject,
      sentAt: daysAgo(1),
      deliveryChannel: ReportDeliveryChannel.IN_APP,
      generatedByCron: false,
      aiSummaryId: "ai-summary-org-001",
      highlights: {
        create: [
          { text: "Lead qualified naik 18%", order: 0 },
          { text: "Burn rate turun menjadi Rp 4,1M", order: 1 },
        ],
      },
      kpis: {
        create: [
          { label: "MRR", value: "Rp 23,2jt", delta: "+9%", trend: ReportTrend.UP, order: 0 },
          { label: "Cost per Lead", value: "Rp 120rb", delta: "-6%", trend: ReportTrend.DOWN, order: 1 },
          { label: "Runway", value: "9,5 bulan", delta: "+0,5", trend: ReportTrend.UP, order: 2 },
        ],
      },
      insightItems: {
        create: [
          {
            title: "Marketing nearing budget cap",
            description: "Sudah mencapai 85% dari alokasi bulan ini.",
            tone: InsightTone.WARNING,
            order: 0,
          },
          {
            title: "Subscription efficiency",
            description: "Penghapusan 2 lisensi menyimpan Rp 420rb/bln.",
            tone: InsightTone.POSITIVE,
            order: 1,
          },
        ],
      },
    },
  });

  console.log("Creating AI conversations & usage...");
  const aiConversationSnapshot: Prisma.JsonObject = {
    transcript: [
      { role: "user", content: "Budget marketing kita terasa boros bulan ini." },
      { role: "assistant", content: "Alihkan 20% ke retargeting untuk efisiensi 28%." },
    ],
  };

  const conversation = await prisma.aIConversation.create({
    data: {
      accountId: orgAccount.id,
      userId: orgAdmin.id,
      model: "gpt-4o-mini",
      questionCountMonth: 3,
      lastQuotaResetAt: daysAgo(15),
      lastUsedAt: daysAgo(1),
      messages: aiConversationSnapshot,
      entries: {
        create: [
          {
            role: AIMessageRole.USER,
            content: "Budget marketing kita terasa boros bulan ini. Ada rekomendasi?",
            tokensUsed: 42,
          },
          {
            role: AIMessageRole.ASSISTANT,
            content: "Hentikan campaign dengan CPC 45% lebih tinggi dan alihkan ke retargeting email.",
            tokensUsed: 68,
            metadata: {
              recommendationType: "budget_reallocation",
            },
          },
        ],
      },
    },
  });

  await prisma.aIUsage.create({
    data: {
      accountId: orgAccount.id,
      userId: orgAdmin.id,
      model: "gpt-4o-mini",
      promptTokens: 520,
      completionTokens: 610,
      latencyMs: 2100,
      costEst: new Prisma.Decimal(0.42),
      createdAt: daysAgo(1),
    },
  });

  console.log("Creating notifications...");
  await prisma.notification.createMany({
    data: [
      {
        accountId: personalAccount.id,
        userId: personalUser.id,
        type: NotificationType.BUDGET_ALERT,
        channel: NotificationChannel.PUSH,
        priority: NotificationPriority.HIGH,
        title: "Budget makan 82%",
        body: "Anda tinggal Rp 630rb sebelum mencapai batas.",
        data: {
          category: "Makanan",
          percent: 0.82,
        },
        linkUrl: "/budgets",
        createdAt: daysAgo(1),
      },
      {
        accountId: orgAccount.id,
        userId: orgOwner.id,
        type: NotificationType.REPORT_READY,
        channel: NotificationChannel.IN_APP,
        title: "Laporan Juli siap",
        body: "Insight AI merekomendasikan optimasi marketing.",
        data: {
          reportId: personalReport.id,
        },
        linkUrl: "/laporan",
        sentAt: daysAgo(2),
      },
      {
        accountId: orgAccount.id,
        userId: orgAdmin.id,
        type: NotificationType.INVITATION,
        channel: NotificationChannel.EMAIL,
        priority: NotificationPriority.NORMAL,
        title: "Undangan member baru",
        body: "pending@org.com menunggu persetujuan.",
        linkUrl: "/team",
        createdAt: daysAgo(3),
      },
    ],
  });

  console.log("Creating audit log entries...");
  await prisma.auditLog.create({
    data: {
      accountId: orgAccount.id,
      actorId: orgAdmin.id,
      targetUserId: orgMember.id,
      action: "membership.update",
      entity: "Membership",
      entityId: orgAdminMembership.id,
      metadata: {
        fromRole: "MEMBER",
        toRole: "ADMIN",
      },
      ip: "36.89.12.10",
      userAgent: "SeedScript/1.0",
    },
  });

  console.log("Seed completed. Login dengan demo1234");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
