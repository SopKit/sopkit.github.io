"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Sparkles, Check } from "lucide-react";

export default function YoutubeTitleGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generate = () => {
    try {
      const getResults = () => {
        
      const kw = topic.trim() || "learn coding";
      return [
        "How to Master " + kw + " (Step-by-Step Guide)",
        "I Tried " + kw + " for 30 Days (Here's What Happened)",
        "The Ultimate " + kw + " Blueprint for Beginners",
        "Avoid These 5 Common " + kw + " Mistakes! ❌",
        "Is " + kw + " Actually Worth It? (Honest Review)",
        "Why Most People Fail at " + kw + " (And How to Fix It)"
      ];
    
      };
      setResults(getResults());
      toast.success("Content generated!");
    } catch {
      toast.error("Generation error");
    }
  };

  const copyResult = (text, index) => {
    navigator.clipboard.writeText(text.replace(/\\n/g, "\n"));
    setCopiedIndex(index);
    toast.success("Copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            YouTube Title Generator Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Specify Topic or Brand details</Label>
            <Input
              id="topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Video topic (e.g., how to build an app)"
            />
          </div>
          <Button onClick={generate} className="w-full gap-2">
            Generate Ideas
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Generated Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.length > 0 ? (
            results.map((res, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/40 border flex justify-between items-start group">
                <div className="whitespace-pre-line text-sm leading-relaxed font-sans">
                  {res.replace(/\\n/g, "\n")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyResult(res, index)}
                  className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity ml-2"
                >
                  {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Your generated content concepts will show up here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
