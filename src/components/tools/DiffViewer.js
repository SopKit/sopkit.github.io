"use client";

import React, { useState } from 'react';
import * as Diff from 'diff';
import { Button } from "@/components/ui/button";
import { FileDiff, ArrowRightLeft } from "lucide-react";

export default function DiffViewer() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState([]);

  const compare = () => {
    const diff = Diff.diffLines(oldText, newText);
    setDiffResult(diff);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Original Text</label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            className="w-full h-64 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder="Paste original text here..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">New Text</label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full h-64 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={compare} className="gap-2 bg-primary">
          <ArrowRightLeft className="w-4 h-4" /> Compare Differences
        </Button>
      </div>

      {diffResult.length > 0 && (
        <div className="glass-card p-6 rounded-xl border border-border overflow-x-auto">
          <pre className="font-mono text-sm">
            {diffResult.map((part, index) => {
              const color = part.added ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                            part.removed ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                            'text-foreground/70';
              return (
                <span key={index} className={`block px-1 ${color}`}>
                  {part.value}
                </span>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
}
