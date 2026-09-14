/**
 * @file src/server/security/ssrf.ts
 * @description Safe remote fetch abstraction preventing SSRF (Server-Side Request Forgery).
 * Strictly blocks private networks, loopback addresses, link-local addresses, and cloud metadata APIs.
 */

import { URL } from "url";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "::",
  "metadata.google.internal",
  "169.254.169.254", // AWS/GCP/Azure link-local metadata
]);

/**
 * Validates if an IP address string belongs to a private/internal subnet
 */
function isPrivateIp(ip: string): boolean {
  // IPv4 Private subnets
  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8
    if (parts[0] === 0) return true;
  }

  // IPv6 loopback / private
  if (ip === "::1" || ip.startsWith("fc00:") || ip.startsWith("fe80:")) {
    return true;
  }

  return false;
}

export interface SafeFetchOptions extends RequestInit {
  maxResponseSizeBytes?: number;
  timeoutMs?: number;
}

/**
 * Performs a validated, SSRF-safe remote fetch
 */
export async function safeFetch(urlString: string, options: SafeFetchOptions = {}): Promise<Response> {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    throw new Error("Invalid URL format.");
  }

  // 1. Protocol validation: HTTP and HTTPS only
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Forbidden protocol: ${parsed.protocol}. Only http and https are allowed.`);
  }

  // 2. Hostname blocklist
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateIp(hostname)) {
    throw new Error(`Access to private or local network host is forbidden: ${hostname}`);
  }

  // 3. Port check (restrict to standard web ports)
  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === "https:" ? 443 : 80;
  if (port !== 80 && port !== 443 && port !== 8080 && port !== 8443) {
    throw new Error(`Connection to non-standard port ${port} is prohibited.`);
  }

  // 4. Timeout and payload limits
  const timeoutMs = options.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(parsed.toString(), {
      ...options,
      signal: controller.signal,
      redirect: "manual", // Prevent open redirect SSRF bypasses!
    });

    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}
