/**
 * @file src/performance/page-profile.ts
 * @description Resolves the explicit PagePerformanceProfile for any route.
 */

import { PagePerformanceProfile, RouteCategory, DeviceType } from "./types";
import { MOBILE_CATEGORY_BUDGETS, DESKTOP_CATEGORY_BUDGETS } from "./budget";

/**
 * Determines the category of a given route path
 */
export function resolveRouteCategory(pathname: string): RouteCategory {
  if (pathname === "/" || pathname === "") {
    return "marketing";
  }
  if (pathname === "/tools" || pathname === "/categories" || pathname === "/explore") {
    return "directory";
  }
  if (pathname.startsWith("/blog") || pathname.startsWith("/articles") || pathname.startsWith("/guides")) {
    return "content";
  }
  if (pathname.startsWith("/docs")) {
    return "documentation";
  }
  if (pathname.startsWith("/developers") || pathname.startsWith("/api-docs")) {
    return "developer";
  }
  if (pathname.startsWith("/embed") || pathname.startsWith("/widget")) {
    return "utility";
  }
  // Default for tool pages and category routes
  return "tool";
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
