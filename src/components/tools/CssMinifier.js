"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileCode, ArrowDown, Copy, RefreshCw, Check, Code } from "lucide-react";

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('minify'); // 'minify' | 'beautify' (simple)

  const processCss = () => {
    if (!input.trim()) return;

    if (mode === 'minify') {
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around separators
        .replace(/;}/g, '}') // Remove last semicolon
        .trim();
      setOutput(minified);
    } else {
      // Simple Beautify logic (not perfect but decent for a lightweight tool)
      const beautified = input
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;/g, ';\n  ')
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}\n')
        .replace(/\s*(\n)\s*/g, '$1')
        .trim();
      setOutput(beautified);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
               <FileCode className="w-4 h-4" /> Input CSS
             </label>
             <div className="flex gap-2">
                <Button 
                   size="sm" 
                   variant={mode === 'minify' ? 'default' : 'secondary'}
                   onClick={() => setMode('minify')}
                   className="h-7 text-xs"
                >
                  Minify
                </Button>
                <Button 
                   size="sm" 
                   variant={mode === 'beautify' ? 'default' : 'secondary'}
                   onClick={() => setMode('beautify')}
                   className="h-7 text-xs"
                >
                  Beautify
                </Button>
             </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=".class { color: red; }"
            className="w-full h-80 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center h-7">
             <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
               <Code className="w-4 h-4" /> Output
             </label>
              {output && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  {Math.round((1 - output.length / input.length) * 100)}% smaller
                </span>
              )}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-80 p-4 bg-secondary/30 border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
         <Button onClick={processCss} className="w-32 gap-2 bg-primary">
            <RefreshCw className="w-4 h-4" /> Process
         </Button>
         <Button onClick={copyToClipboard} variant="secondary" className="w-32 gap-2" disabled={!output}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
         </Button>
      </div>
    </div>
  );
}
