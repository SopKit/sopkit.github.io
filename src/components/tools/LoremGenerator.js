"use client";

import React, { useState } from 'react';
import { LoremIpsum } from "lorem-ipsum";
import { Button } from "@/components/ui/button";
import { Type, Copy, RefreshCw, Check, AlignLeft } from "lucide-react";

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState('paragraphs'); // paragraphs, sentences, words
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  const generate = () => {
    let text = '';
    if (unit === 'paragraphs') {
      text = lorem.generateParagraphs(count);
    } else if (unit === 'sentences') {
      text = lorem.generateSentences(count);
    } else {
      text = lorem.generateWords(count);
    }
    setOutput(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
               <label className="text-sm font-medium">Count:</label>
               <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2"
              />
            </div>
            
            <select 
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
             <Button onClick={generate} className="flex-1 md:flex-none gap-2 bg-primary">
                <RefreshCw className="w-4 h-4" /> Generate
             </Button>
             <Button onClick={copyToClipboard} variant="secondary" className="flex-1 md:flex-none gap-2" disabled={!output}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
             </Button>
          </div>
        </div>

        <div className="relative min-h-[300px]">
           <textarea
            readOnly
            value={output}
            placeholder="Lorem ipsum dolor sit amet..."
            className="w-full h-full min-h-[300px] p-6 bg-background/50 border border-border rounded-xl font-serif text-lg leading-relaxed focus:ring-2 focus:ring-primary outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
