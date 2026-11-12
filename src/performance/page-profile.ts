/**
 * @file src/performance/page-profile.ts
 * @description Resolves the explicit PagePerformanceProfile for any route.
 */

import { PagePerformanceProfile, RouteCategory, DeviceType } from "./types";
import { MOBILE_CATEGORY_BUDGETS, DESKTOP_CATEGORY_BUDGETS } from "./budget";

/**
 * Determines the category of a given route path
 */
const MARKETING_ROUTES = new Set(["/", "", "/about", "/contact", "/pro"]);
const LEGAL_CONTENT_ROUTES = new Set(["/privacy", "/terms", "/dmca", "/editorial-policy"]);
const DIRECTORY_ROUTES = new Set(["/tools", "/archive", "/new-tools", "/tool-guides", "/packages", "/search"]);

export function resolveRouteCategory(pathname: string): RouteCategory {
  const route = normalizeRoute(pathname);

  if (MARKETING_ROUTES.has(route)) {
    return "marketing";
  }
  if (LEGAL_CONTENT_ROUTES.has(route)) {
    return "content";
  }
  // Long-form content lives under /blog/* and /tool-guides/<slug>; checked
  // before the hub suffix so "/blog/top-tools" is content, not a hub.
  if (route.startsWith("/blog") || route.startsWith("/tool-guides/")) {
    return "content";
  }
  // Hubs: /tools, /archive, /new-tools, /tool-guides, /packages, /search and
  // every category hub (/image-tools, /pdf-tools, ..., /calculators).
  if (DIRECTORY_ROUTES.has(route) || route.endsWith("-tools") || route === "/calculators") {
    return "directory";
  }
  if (route.startsWith("/embed")) {
    return "utility";
  }
  // Default for tool pages
  return "tool";
}

function normalizeRoute(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/)[0] || "";
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

/**
 * Gets the performance budget profile for a specific route and device
 */
export function getPagePerformanceProfile(
  pathname: string,
  device: DeviceType = "mobile"
): PagePerformanceProfile {
  const category = resolveRouteCategory(pathname);
  const budgets = device === "desktop" ? DESKTOP_CATEGORY_BUDGETS : MOBILE_CATEGORY_BUDGETS;
  const baseProfile = budgets[category];

  return {
    ...baseProfile,
    routePattern: pathname,
  };
}
