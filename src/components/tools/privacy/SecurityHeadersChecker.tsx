"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const IMPORTANT_HEADERS: Record<string, { good: string; desc: string }> = {
  "strict-transport-security": { good: "present", desc: "HSTS enforces HTTPS connections" },
  "content-security-policy": { good: "present", desc: "CSP prevents XSS attacks" },
  "x-frame-options": { good: "DENY|SAMEORIGIN", desc: "Prevents clickjacking" },
  "x-content-type-options": { good: "nosniff", desc: "Prevents MIME type sniffing" },
  "referrer-policy": { good: "present", desc: "Controls referrer information" },
  "permissions-policy": { good: "present", desc: "Restricts browser feature access" },
  "x-xss-protection": { good: "1; mode=block", desc: "Cross-site scripting filter" },
  "cache-control": { good: "present", desc: "Browser caching directives" },
};

export default function SecurityHeadersChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ headers: Record<string, string>; score: number; issues: string[] } | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    setLoading(true);
    setError("");
    try {
      const target = url.startsWith("http") ? url : "https://" + url;
      const resp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
      const data: any = await resp.json();
      const entries = (data.contents?.headers || []).map((h: string) => h.split(": "));
      const headers: Record<string, string> = {};
      entries.forEach(([k, v]: string[]) => { headers[k?.toLowerCase()] = v; });

      let score = 0;
      const issues: string[] = [];
      for (const [name, cfg] of Object.entries(IMPORTANT_HEADERS)) {
        const val = headers[name];
        if (val) {
          if (cfg.good === "present" || new RegExp(cfg.good, "i").test(val)) score += 12.5;
          else issues.push(`${name}: present but misconfigured`);
        } else {
          issues.push(`${name}: missing — ${cfg.desc}`);
        }
      }
      setResult({ headers, score: Math.round(score), issues });
    } catch {
      setError("Could not fetch headers. The site may not allow CORS requests.");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Security Headers Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} />
        <Button onClick={check} disabled={loading || !url}>{loading ? "Checking..." : "Check Headers"}</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className="text-xl font-bold">{result.score}/100</span>
              <span className={`text-sm ${result.score >= 75 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                {result.score >= 75 ? "Good" : result.score >= 50 ? "Average" : "Poor"}
              </span>
            </div>
            {result.issues.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                {result.issues.map((iss, i) => <li key={i}>{iss}</li>)}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
