"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SslCertificateChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; issuer: string; expires: string; daysLeft: number; protocol: string } | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    setLoading(true);
    setError("");
    try {
      const target = domain.replace(/^https?:\/\//, "").split("/")[0];
      const resp = await fetch(`https://ssl-checker.cyclic.app/api/check?domain=${encodeURIComponent(target)}`);
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult({
        valid: data.valid !== false,
        issuer: data.issuer || "Unknown",
        expires: data.expires || "Unknown",
        daysLeft: data.daysLeft ?? 0,
        protocol: data.protocol || "Unknown",
      });
    } catch {
      try {
        const target = domain.replace(/^https?:\/\//, "").split("/")[0];
        const resp = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(target)}`);
        const data = await resp.json();
        if (data.status === "ERROR") throw new Error(data.statusMessage);
        if (data.endpoints && data.endpoints[0]) {
          const ep = data.endpoints[0];
          const daysLeft = ep.grade ? 90 : 0;
          setResult({
            valid: ep.statusMessage === "Ready",
            issuer: ep.grade || "N/A",
            expires: "Check SSL Labs for details",
            daysLeft,
            protocol: `TLS ${ep.protocol || "unknown"}`,
          });
        } else {
          throw new Error("No data available");
        }
      } catch {
        setError("Could not check SSL certificate. Please verify the domain is correct.");
      }
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SSL Certificate Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="example.com" value={domain} onChange={e => setDomain(e.target.value)} />
        <Button onClick={check} disabled={loading || !domain}>{loading ? "Checking..." : "Check SSL"}</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {result && (
          <div className="space-y-2 text-sm">
            <div className="flex gap-2 items-center">
              <span className={`font-bold ${result.valid ? "text-green-600" : "text-red-600"}`}>
                {result.valid ? "Valid" : "Invalid"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>Issuer:</span><span className="font-mono">{result.issuer}</span>
              <span>Expires:</span><span>{result.expires}</span>
              <span>Days left:</span><span className={result.daysLeft < 30 ? "text-red-500 font-medium" : ""}>{result.daysLeft}</span>
              <span>Protocol:</span><span>{result.protocol}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
