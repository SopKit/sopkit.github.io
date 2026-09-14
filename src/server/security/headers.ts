/**
 * @file src/server/security/headers.ts
 * @description Centralized HTTP security headers including Content-Security-Policy.
 */

export function buildSecurityHeaders(): Record<string, string> {
  const isProd = process.env.NODE_ENV === "production";

  // Content Security Policy
  // Allows necessary local WebAssembly ('wasm-unsafe-eval') & Web Workers ('blob:') for in-browser tool computation
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://pagead2.googlesyndication.com",
    "worker-src 'self' blob:",
    "frame-src 'self' https://googleads.g.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ];

  return {
    "Content-Security-Policy": cspDirectives.join("; "),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  };
}
