/**
 * @file src/performance/resource-hints.ts
 * @description Safe, audited resource hint generator.
 * Eliminates unneeded preconnects flagged in the PageSpeed audit.
 */

export interface ResourceHint {
  rel: "preconnect" | "dns-prefetch" | "preload";
  href: string;
  as?: "script" | "style" | "font" | "image";
  crossOrigin?: "" | "anonymous" | "use-credentials";
  type?: string;
}

/**
 * Audit: baseline flagged unused preconnect to Google Tag Manager.
 * We only preconnect to domains that are guaranteed to have immediate, early, above-the-fold requests.
 */
export function getPageResourceHints(pathname: string): ResourceHint[] {
  const hints: ResourceHint[] = [];

  // No font preconnect: SopKit uses a system font stack (--font-sans /
  // --font-serif / --font-mono in globals.css), so no font files are fetched.

  // CDN domain preconnect for external assets only if on specific media-heavy routes
  if (pathname.startsWith("/tools/image-") || pathname.startsWith("/tools/video-")) {
    hints.push({
      rel: "dns-prefetch",
      href: "https://cdnjs.cloudflare.com",
    });
  }

  return hints;
}
