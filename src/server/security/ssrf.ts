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

function normalizeHost(hostname: string): string {
  // Strip IPv6 brackets (`[::1]` -> `::1`), zone IDs, and trailing DNS root dots
  return hostname
    .toLowerCase()
    .replace(/^\[(.*)\]$/, "$1")
    .split("%")[0]
    .replace(/\.+$/, "");
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 169.254.0.0/16 (Link-local / Cloud metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8
  if (parts[0] === 0) return true;
  return false;
}

/**
 * Validates if an IP address string belongs to a private/internal subnet
 */
function isPrivateIp(rawIp: string): boolean {
  const ip = normalizeHost(rawIp);

  if (isPrivateIpv4(ip)) {
    return true;
  }

  // IPv4-mapped IPv6 (`::ffff:127.0.0.1` or URL-normalized `::ffff:7f00:1`)
  if (ip.startsWith("::ffff:")) {
    const suffix = ip.slice("::ffff:".length);
    if (isPrivateIpv4(suffix)) {
      return true;
    }
    const hexGroups = suffix.split(":");
    if (hexGroups.length === 2) {
      const hi = parseInt(hexGroups[0], 16);
      const lo = parseInt(hexGroups[1], 16);
      if (!Number.isNaN(hi) && !Number.isNaN(lo)) {
        const ipv4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
        if (isPrivateIpv4(ipv4)) {
          return true;
        }
      }
    }
  }

  // IPv6 loopback / unspecified (`::1`, `::`, `0:0:0:0:0:0:0:1`, `0:0:0:0:0:0:0:0`)
  if (
    ip === "::1" ||
    ip === "::" ||
    /^0{1,4}(:0{1,4}){6}:0{0,3}[01]$/.test(ip)
  ) {
    return true;
  }

  // IPv6 ULA (`fc00::/7`: `fc00..fdff`) and link-local (`fe80::/10`: `fe80..febf`)
  const firstHextet = ip.split(":")[0];
  if (firstHextet) {
    const value = parseInt(firstHextet, 16);
    if (!Number.isNaN(value)) {
      if ((value & 0xfe00) === 0xfc00) return true;
      if ((value & 0xffc0) === 0xfe80) return true;
    }
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
  const hostname = normalizeHost(parsed.hostname);
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
  const maxBytes = options.maxResponseSizeBytes;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const { maxResponseSizeBytes: _max, timeoutMs: _timeout, ...fetchOptions } = options;

  try {
    const res = await fetch(parsed.toString(), {
      ...fetchOptions,
      signal: controller.signal,
      redirect: "manual", // Prevent open redirect SSRF bypasses!
    });

    if (maxBytes !== undefined) {
      const contentLengthHeader = res.headers.get("content-length");
      if (contentLengthHeader !== null) {
        const contentLength = Number(contentLengthHeader);
        if (Number.isFinite(contentLength) && contentLength > maxBytes) {
          await res.body?.cancel();
          throw new Error(`Response size (${contentLength} bytes) exceeds limit of ${maxBytes} bytes.`);
        }
      }

      if (res.body) {
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let totalBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytes += value.byteLength;
            if (totalBytes > maxBytes) {
              await reader.cancel();
              throw new Error(`Response size exceeds limit of ${maxBytes} bytes.`);
            }
            chunks.push(value);
          }
        }

        const combined = new Uint8Array(totalBytes);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.byteLength;
        }

        return new Response(combined, {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });
      }
    }

    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}
