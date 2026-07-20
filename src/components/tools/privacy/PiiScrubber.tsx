"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const patterns = [
  { name: "Email", regex: /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g },
  { name: "Phone", regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g },
  { name: "SSN", regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: "IP Address", regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  { name: "Credit Card", regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g },
  { name: "ZIP Code", regex: /\b\d{5}(-\d{4})?\b/g },
];

export default function PiiScrubber() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [maskWith, setMaskWith] = useState("[REDACTED]");
  const [found, setFound] = useState<string[]>([]);

  const scrub = () => {
    let result = input;
    const detected: string[] = [];
    for (const p of patterns) {
      const matches = result.match(p.regex);
      if (matches) detected.push(...matches.map(m => `${p.name}: ${m}`));
      result = result.replace(p.regex, maskWith);
    }
    setOutput(result);
    setFound(detected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">PII Scrubber</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste text containing personal information..." value={input} onChange={e => setInput(e.target.value)} rows={6} />
        <div className="flex gap-2 items-center">
          <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="Mask with..." value={maskWith} onChange={e => setMaskWith(e.target.value)} />
          <Button onClick={scrub} disabled={!input}>Scrub</Button>
        </div>
        {output && (
          <div className="space-y-2">
            <div className="p-3 border rounded bg-muted/50 text-sm whitespace-pre-wrap">{output}</div>
            {found.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Detected & redacted ({found.length}):</p>
                <ul className="list-disc pl-4">{found.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(output); }}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
