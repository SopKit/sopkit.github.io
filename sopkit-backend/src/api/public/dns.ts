/**
 * @file sopkit-backend/src/api/public/dns.ts
 * @description Edge API for DNS-over-HTTPS (DoH) domain lookups.
 */

import { Hono } from "hono";
import { z } from "zod";

export const dnsRouter = new Hono();

const DnsQuerySchema = z.object({
  name: z.string().min(1).max(253),
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA"]).default("A"),
});

const TYPE_CODES: Record<string, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  CAA: 257,
};

dnsRouter.get("/", async (c) => {
  const name = c.req.query("name");
  const type = (c.req.query("type") || "A").toUpperCase();

  const parsed = DnsQuerySchema.safeParse({ name, type });
  if (!parsed.success) {
    return c.json({ error: "Invalid DNS query parameters", details: parsed.error.format() }, 400);
  }

  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(parsed.data.name)}&type=${parsed.data.type}`;

    const res = await fetch(dohUrl, {
      headers: {
        Accept: "application/dns-json",
      },
    });

    if (!res.ok) {
      return c.json({ error: "DNS upstream resolution failed", status: res.status }, 502);
    }

    const data = await res.json() as any;

    return c.json({
      query: {
        name: parsed.data.name,
        type: parsed.data.type,
      },
      status: data.Status,
      tc: data.TC || false,
      rd: data.RD || false,
      ra: data.RA || false,
      answers: data.Answer || [],
      authority: data.Authority || [],
    }, 200, {
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "DNS resolution failed";
    return c.json({ error: msg }, 500);
  }
});
