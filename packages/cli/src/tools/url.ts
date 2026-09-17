/**
 * @file packages/cli/src/tools/url.ts
 * @description URL inspector, parser, and encoder/decoder for SopKit CLI.
 */

export interface ParsedUrl {
  href: string;
  protocol: string;
  origin: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

export function parseUrl(input: string): ParsedUrl {
  let target = input.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }
  const u = new URL(target);
  const params: Record<string, string> = {};
  u.searchParams.forEach((val, key) => {
    params[key] = val;
  });

  return {
    href: u.href,
    protocol: u.protocol,
    origin: u.origin,
    host: u.host,
    hostname: u.hostname,
    port: u.port || "(default)",
    pathname: u.pathname,
    search: u.search || "(none)",
    hash: u.hash || "(none)",
    params,
  };
}

export function encodeUrl(str: string, component = true): string {
  return component ? encodeURIComponent(str) : encodeURI(str);
}

export function decodeUrl(str: string, component = true): string {
  return component ? decodeURIComponent(str) : decodeURI(str);
}
