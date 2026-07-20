"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailDeliverabilityChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ spf: string; dkim: string[]; dmarc: string; score: number } | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    setLoading(true);
    setError("");
    const clean = domain.replace(/^https?:\/\//, "").split("/")[0].split("@").pop() || domain;
    let spf = "Not found";
    const dkim: string[] = [];
    let dmarc = "Not found";
    let score = 0;

    try {
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=TXT`);
      const data = await resp.json();
      const records = (data.Answer || []).map((r: any) => r.data);

      const spfRec = records.find((r: string) => r.includes("v=spf1"));
      if (spfRec) { spf = "Found ✓"; score += 35; dkim.push(spfRec.slice(0, 100)); }
      else { spf = "Missing"; }

      const dkimRecs = records.filter((r: string) => r.includes("v=DKIM1"));
      if (dkimRecs.length > 0) { dkim.push(`Found ${dkimRecs.length} DKIM record(s)`); score += 35; }
      else { dkim.push("Not found"); }
    } catch {
      setError("DNS lookup failed");
    }

    try {
      const dmarcResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent("_dmarc." + clean)}&type=TXT`);
      const dmarcData = await dmarcResp.json();
      const dmarcRec = (dmarcData.Answer || []).find((r: any) => r.data.includes("v=DMARC1"));
      if (dmarcRec) { dmarc = `Found (${dmarcRec.data.slice(0, 80)})`; score += 30; }
      else { dmarc = "Not found — consider implementing DMARC policy"; }
    } catch {}

    setResult({ spf, dkim, dmarc, score });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Deliverability Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="yourdomain.com or your@email.com" value={domain} onChange={e => setDomain(e.target.value)} />
        <Button onClick={check} disabled={loading || !domain}>{loading ? "Checking..." : "Check Deliverability"}</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {result && (
          <div className="space-y-2 text-sm">
            <div className="flex gap-2 items-center">
              <span className={`text-lg font-bold ${result.score >= 70 ? "text-green-600" : result.score >= 35 ? "text-yellow-600" : "text-red-600"}`}>
                {result.score >= 70 ? "Good" : result.score >= 35 ? "Needs work" : "Poor"} ({result.score}/100)
              </span>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
              <span className="text-muted-foreground">SPF:</span><span className={result.spf.includes("Found") ? "text-green-600" : "text-red-600"}>{result.spf}</span>
              <span className="text-muted-foreground">DKIM:</span><span>{result.dkim[0]}</span>
              <span className="text-muted-foreground">DMARC:</span><span className={result.dmarc.includes("Found") ? "text-green-600" : "text-yellow-600"}>{result.dmarc}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
