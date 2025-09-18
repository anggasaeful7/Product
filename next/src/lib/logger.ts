export function logWithRequestId(requestId: string | null | undefined, message: string, extra?: Record<string, unknown>) {
  const payload = { requestId: requestId ?? 'unknown', message, ...(extra ?? {}) };
  // Placeholder: integrate with Pino or another logger later
  console.log(JSON.stringify(payload));
}

