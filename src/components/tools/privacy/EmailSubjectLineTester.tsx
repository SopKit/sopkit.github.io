"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailSubjectLineTester() {
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const analyze = () => {
    let s = 50;
    const len = subject.length;
    if (len < 30) s += 10;
    else if (len < 60) s += 20;
    else if (len < 90) s += 10;
    else s -= 10;

    const spamWords = ["free", "act now", "limited time", "buy now", "click here", "urgent", "guaranteed", "congratulations"];
    const powerWords = ["discover", "how to", "your", "you", "new", "introducing", "announcing", "instant", "proven"];
    const lower = subject.toLowerCase();
    const hasSpam = spamWords.some(w => lower.includes(w));
    if (hasSpam) s -= 15;
    const hasPower = powerWords.some(w => lower.includes(w));
    if (hasPower) s += 10;
    if (subject.endsWith("?")) s += 5;
    if (/[!?]{2,}/.test(subject)) s -= 10;
    const isUpper = subject === subject.toUpperCase() && subject.length > 3;
    if (isUpper) s -= 15;

    setScore(Math.max(0, Math.min(100, s)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Subject Line Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Enter your email subject line..." value={subject} onChange={e => setSubject(e.target.value)} />
        <Button onClick={analyze} disabled={!subject}>Analyze</Button>
        {score !== null && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-bold">{score}/100</div>
              <div className={`h-3 flex-1 rounded-full bg-muted overflow-hidden`}>
                <div className={`h-full rounded-full transition-all ${
                  score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"
                }`} style={{ width: `${score}%` }} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {score >= 70 ? "Great subject line! Ready to send." : score >= 40 ? "Decent, but could be improved for better opens." : "Needs work. Avoid spam triggers and all-caps."}
            </p>
            <p className="text-xs text-muted-foreground">Character count: {subject.length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
