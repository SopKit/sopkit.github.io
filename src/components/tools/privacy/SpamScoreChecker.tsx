"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SpamScoreChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ score: number; issues: string[] } | null>(null);

  const check = () => {
    const issues: string[] = [];
    let score = 100;

    const words = input.split(/\s+/).filter(Boolean);
    const urls = (input.match(/https?:\/\/[^\s]+/g) || []);

    const lower = input.toLowerCase();
    const spammy = [
      { word: "free", weight: 5 }, { word: "guaranteed", weight: 8 }, { word: "act now", weight: 10 },
      { word: "limited time", weight: 8 }, { word: "click here", weight: 7 }, { word: "buy now", weight: 10 },
      { word: "congratulations", weight: 10 }, { word: "winner", weight: 10 }, { word: "urgent", weight: 6 },
      { word: "exclusive deal", weight: 7 }, { word: "risk free", weight: 8 }, { word: "no cost", weight: 5 },
      { word: "double your", weight: 8 }, { word: "earn extra", weight: 8 }, { word: "work from home", weight: 5 },
    ];

    for (const s of spammy) {
      if (lower.includes(s.word)) {
        score -= s.weight;
        issues.push(`Spam trigger: "${s.word}" (${s.weight >= 8 ? "high risk" : "medium risk"})`);
      }
    }

    if (urls.length > 3) { score -= 10; issues.push(`Too many links (${urls.length})`); }
    if (urls.length > 0) {
      const hasShortLinks = urls.some(u => u.includes("bit.ly") || u.includes("tinyurl") || u.includes("shorturl"));
      if (hasShortLinks) { score -= 8; issues.push("URL shorteners detected"); }
    }

    if (words.length < 10) { score -= 5; issues.push("Very short email content"); }
    if (input.toUpperCase() === input && input.length > 20) { score -= 10; issues.push("Excessive use of ALL CAPS"); }
    if ((input.match(/[!?]{2,}/g) || []).length > 0) { score -= 6; issues.push("Excessive punctuation (!! or ??)"); }
    if (lower.includes("this is not spam")) { score -= 15; issues.push('Contains "this is not spam" (ironic trigger)'); }
    if (words.length > 0) {
      const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;
      if (avgLen > 8) { score -= 3; issues.push("Unusually long words"); }
    }

    setResult({ score: Math.max(0, Math.min(100, score)), issues });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spam Score Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste your email or message content to check its spam score..." value={input} onChange={e => setInput(e.target.value)} rows={6} />
        <Button onClick={check} disabled={!input}>Check Spam Score</Button>
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className={`text-2xl font-bold ${result.score >= 70 ? "text-green-600" : result.score >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                {result.score}/100
              </div>
              <span className="text-sm">{result.score >= 70 ? "Likely to reach inbox" : result.score >= 40 ? "May be filtered" : "High spam risk"}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${result.score >= 70 ? "bg-green-500" : result.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${result.score}%` }} />
            </div>
            {result.issues.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5">
                {result.issues.map((iss, i) => <li key={i}>{iss}</li>)}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
