import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function proxy(request) {
  const nonce = nanoid();

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,  // unsafe-inline needed for some CSS-in-JS
    "img-src 'self' blob: data: https: https://www.googletagmanager.com",
    "font-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  // Apply to all routes except static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
