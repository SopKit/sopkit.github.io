"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AiTextDetector() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ score: number; details: string[] } | null>(null);

  const analyze = () => {
    const details: string[] = [];
    const words = input.split(/\s+/).filter(Boolean);
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordLen = words.reduce((a, w) => a + w.length, 0) / (words.length || 1);

    let aiScore = 50;

    if (avgWordLen > 5.5) { aiScore += 10; details.push("Unusually long average word length"); }
    if (words.length > 100 && avgWordLen > 4.8) { aiScore += 5; details.push("Text length × word length pattern suggests AI"); }
    if (sentences.length > 0) {
      const avgSentenceLen = words.length / sentences.length;
      if (avgSentenceLen > 25) { aiScore += 10; details.push("Sentences are consistently long"); }
      if (avgSentenceLen < 8) { aiScore -= 5; details.push("Sentences are very short (typical of human writing)"); }
    }

    const aiPhrases = ["delve into", "in the realm of", "it is important to note", "a tapestry", "landscape", "leverage", "utilize", "foster", "showcase", "testament", "paramount", "meticulously", "robust", "cutting-edge", "ever-evolving", "game-changer", "revolutionize"];
    const aiCount = aiPhrases.filter(p => input.toLowerCase().includes(p)).length;
    if (aiCount > 2) { aiScore += 15; details.push(`Contains ${aiCount} AI-typical phrases`); }
    if (aiCount > 0) details.push(`AI-typical phrases found: ${aiCount}`);

    const variation = new Set(words.map(w => w.toLowerCase())).size / (words.length || 1);
    if (variation < 0.4) { aiScore += 5; details.push("Low vocabulary variation"); }

    setResult({ score: Math.max(0, Math.min(100, aiScore)), details });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Text Detector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="Paste text to analyze..." value={input} onChange={e => setInput(e.target.value)} rows={6} />
        <Button onClick={analyze} disabled={input.length < 20}>Analyze</Button>
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-bold">{result.score}%</div>
              <span className="text-sm">{result.score >= 60 ? "Likely AI-generated" : result.score >= 35 ? "Uncertain" : "Likely human-written"}</span>
            </div>
            {result.details.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                {result.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
