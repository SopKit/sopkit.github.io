"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PhishingUrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ risk: number; flags: string[] } | null>(null);

  const check = () => {
    const flags: string[] = [];
    let risk = 0;
    const lower = url.toLowerCase();

    if (!url.startsWith("http")) flags.push("Missing protocol (http/https)");
    if (lower.includes("@")) { risk += 20; flags.push("Contains '@' (URL confusing)");
    } if (/\d{4,}/.test(lower.split("/")[2] || "")) { risk += 10; flags.push("IP address instead of domain name");
    } if ((lower.match(/https?:\/\//g) || []).length > 1) { risk += 15; flags.push("Multiple protocols detected");
    } if ((lower.match(/-/g) || []).length > 3) { risk += 10; flags.push("Excessive hyphens in domain");
    } if (/[^\x00-\x7f]/.test(url)) { risk += 15; flags.push("Unicode characters (homograph attack risk)");
    } if (/\.(tk|ml|ga|cf|gq|xyz|top|work|bid|trade|webcam|science|date|racing|review|stream|download|myftpupload|fastly|firebaseapp|netlify|vercel|pages\.dev)/i.test(url)) { risk += 15; flags.push("Suspicious TLD");
    } try {
      const hostname = new URL(url.startsWith("http") ? url : "http://" + url).hostname;
      const parts = hostname.split(".");
      const knownSuffix = ["com", "org", "net", "gov", "edu", "io", "co", "ai", "app", "dev"];
      if (parts.length > 3 && !knownSuffix.includes(parts[parts.length - 1])) { risk += 10; flags.push("Unusually deep subdomain structure");
      }
      const legitDomains = ["google", "facebook", "amazon", "apple", "microsoft", "paypal", "netflix", "instagram", "twitter", "linkedin", "whatsapp", "dropbox", "adobe", "spotify"];
      const found = legitDomains.find(d => hostname.includes(d));
      if (found) {
        const hostLower = hostname.toLowerCase();
        const legitTld = hostLower.endsWith("." + found + ".com") || hostLower.endsWith("." + found + ".org") || hostLower === found + ".com" || hostLower === found + ".org";
        if (!legitTld) { risk += 25; flags.push(`Suspicious: contains "${found}" but may not be the real domain`); }
      }
    } catch { flags.push("Invalid URL format"); risk += 5; }

    setResult({ risk: Math.min(100, risk), flags });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Phishing URL Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Paste a URL to check..." value={url} onChange={e => setUrl(e.target.value)} />
        <Button onClick={check} disabled={!url}>Check</Button>
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className={`text-xl font-bold ${result.risk >= 40 ? "text-red-500" : result.risk >= 15 ? "text-yellow-500" : "text-green-500"}`}>
                {result.risk >= 40 ? "Suspicious" : result.risk >= 15 ? "Caution" : "Looks safe"}
              </div>
              <span className="text-sm text-muted-foreground">Risk score: {result.risk}/100</span>
            </div>
            {result.flags.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                {result.flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
