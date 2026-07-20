"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SPAM_WORDS = [
  "free", "act now", "limited time", "buy now", "click here", "urgent", "guaranteed",
  "congratulations", "winner", "exclusive deal", "amazing", "unlimited", "million dollars",
  "no cost", "risk free", "satisfaction guaranteed", "opt in", "double your", "earn extra",
  "extra cash", "fast cash", "instant", "investment", "lottery", "make money", "promise",
  "refinance", "shopping spree", "sign up free", "special promotion", "this is not spam",
  "while you sleep", "work from home", "you are a winner", "social security", "click below",
  "order now", "subscribe", "meet singles", "direct email", "dear friend", "no questions asked",
];

export default function SpamWordChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ score: number; found: string[] } | null>(null);

  const check = () => {
    const lower = input.toLowerCase();
    const found = SPAM_WORDS.filter(w => lower.includes(w));
    const score = Math.min(100, Math.round((found.length / Math.max(1, input.split(/\s+/).length)) * 1000));
    setResult({ score, found });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spam Word Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste your email content to check for spam words..." value={input} onChange={e => setInput(e.target.value)} rows={6} />
        <Button onClick={check} disabled={!input}>Check</Button>
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-bold">{result.score}%</div>
              <span className="text-sm">{result.score > 20 ? "High spam risk" : result.score > 5 ? "Moderate risk" : "Low spam risk"}</span>
            </div>
            {result.found.length > 0 ? (
              <>
                <p className="text-sm font-medium">Spam trigger words found ({result.found.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {result.found.map((w, i) => <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">{w}</span>)}
                </div>
              </>
            ) : (
              <p className="text-sm text-green-600">No spam trigger words detected.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
