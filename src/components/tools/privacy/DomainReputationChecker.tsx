"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DomainReputationChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; flags: string[]; info: string } | null>(null);

  const check = async () => {
    setLoading(true);
    const flags: string[] = [];
    let score = 50;
    const clean = domain.replace(/^https?:\/\//, "").split("/")[0];

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=A`);
      const dnsData = await resp.json();
      if (dnsData.Answer && dnsData.Answer.length > 0) {
        score += 10;
        flags.push("Domain resolves: Yes");
      } else {
        score -= 20;
        flags.push("Domain does not resolve");
      }
    } catch {
      flags.push("Could not verify DNS resolution");
    }

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=TXT`);
      const data = await resp.json();
      const txtRecords = (data.Answer || []).map((r: any) => r.data);
      if (txtRecords.some((t: string) => t.includes("v=spf1"))) { score += 5; flags.push("SPF record found"); }
      if (txtRecords.some((t: string) => t.includes("google-site-verification") || t.includes("ms="))) { score += 5; flags.push("Verification records found"); }
    } catch {}

    const age = extractAge(clean);
    if (age !== null) {
      if (age < 30) { score -= 15; flags.push(`Domain is very young (${age} days)`); }
      else if (age < 365) { score -= 5; flags.push(`Domain is less than a year old`); }
      else { score += 10; flags.push(`Domain is established (>1 year)`); }
    }

    const suspiciousTlds = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".work", ".bid", ".trade", ".webcam", ".science", ".date", ".racing", ".review", ".stream", ".download"];
    const tld = "." + clean.split(".").pop();
    if (suspiciousTlds.includes(tld)) { score -= 15; flags.push(`Suspicious TLD: ${tld}`); }

    setResult({ score: Math.max(0, Math.min(100, score)), flags, info: `${clean} reputation analysis complete` });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Domain Reputation Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="example.com" value={domain} onChange={e => setDomain(e.target.value)} />
        <Button onClick={check} disabled={loading || !domain}>{loading ? "Checking..." : "Check Reputation"}</Button>
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className={`text-lg font-bold ${result.score >= 70 ? "text-green-600" : result.score >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                {result.score >= 70 ? "Good" : result.score >= 40 ? "Average" : "Poor"}
              </span>
              <span className="text-sm text-muted-foreground">Score: {result.score}/100</span>
            </div>
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
              {result.flags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function extractAge(domain: string): number | null {
  return null; // Requires WHOIS API
}
