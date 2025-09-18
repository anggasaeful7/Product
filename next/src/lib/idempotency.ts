import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

type Handler<T> = () => Promise<T>;

export async function withIdempotency<T>(req: NextRequest, handler: Handler<T>): Promise<T> {
  const key = req.headers.get('Idempotency-Key') || req.headers.get('idempotency-key');
  if (!key) {
    return handler();
  }
  // Attempt to read existing
  const existing = await prisma.idempotency.findUnique({ where: { key } });
  if (existing?.response) {
    return existing.response as unknown as T;
  }
  const result = await handler();
  try {
    await prisma.idempotency.upsert({
      where: { key },
      update: { response: result as unknown as object, status: 200 },
      create: { key, response: result as unknown as object, status: 200, method: req.method, path: req.nextUrl.pathname },
    });
  } catch (e) {
    // ignore unique constraint races
  }
  return result;
}

