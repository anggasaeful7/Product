import { NextResponse, type NextRequest } from 'next/server';

function generateNonce() {
  // Simple UUID-based nonce (no hyphens) suitable for CSP 'nonce-...'
  return crypto.randomUUID().replace(/-/g, '');
}

export function middleware(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const nonce = generateNonce();

  const res = NextResponse.next({ request: { headers: req.headers } });

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Content Security Policy with nonce for inline scripts/styles
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "script-src 'self' 'nonce-" + nonce + "' https://cdn.posthog.com",
    "style-src 'self' 'unsafe-inline'", // Tailwind in dev may need inline styles
    "connect-src 'self' https://*.ingest.sentry.io https://app.posthog.com",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);

  // Propagate request id and nonce to client and server components
  res.headers.set('x-request-id', requestId);
  res.headers.set('x-nonce', nonce);

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
};
