"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EmailHeaderAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ spf: string; dkim: string; dmarc: string; hops: number; paths: string[] } | null>(null);

  const analyze = () => {
    const paths: string[] = [];
    let hops = 0;
    let spf = "Not found";
    let dkim = "Not found";
    let dmarc = "Not found";

    const lines = input.split("\n");
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith("received: from")) {
        hops++;
        const match = line.match(/from\s+([^\s]+)/);
        if (match) paths.push(match[1]);
      }
      if (lower.includes("spf=")) {
        const m = lower.match(/spf=(\w+)/);
        if (m) spf = m[1];
      }
      if (lower.includes("dkim=")) {
        const m = lower.match(/dkim=(\w+)/);
        if (m) dkim = m[1];
      }
      if (lower.includes("dmarc=")) {
        const m = lower.match(/dmarc=(\w+)/);
        if (m) dmarc = m[1];
      }
    }
    setResult({ spf, dkim, dmarc, hops, paths });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Header Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste raw email headers (including Received, SPF, DKIM, DMARC lines)..." value={input} onChange={e => setInput(e.target.value)} rows={8} />
        <Button onClick={analyze} disabled={!input}>Analyze</Button>
        {result && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">SPF:</span>
              <span className={result.spf === "pass" ? "text-green-600" : result.spf === "fail" ? "text-red-600" : "text-yellow-600"}>{result.spf}</span>
              <span className="text-muted-foreground">DKIM:</span>
              <span className={result.dkim === "pass" ? "text-green-600" : result.dkim === "fail" ? "text-red-600" : "text-yellow-600"}>{result.dkim}</span>
              <span className="text-muted-foreground">DMARC:</span>
              <span className={result.dmarc === "pass" ? "text-green-600" : result.dmarc === "fail" ? "text-red-600" : "text-yellow-600"}>{result.dmarc}</span>
              <span className="text-muted-foreground">Hops (relays):</span><span>{result.hops}</span>
            </div>
            {result.paths.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Routing path:</p>
                <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-0.5">
                  {result.paths.map((p, i) => <li key={i} className="font-mono">{p}</li>)}
                </ol>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
