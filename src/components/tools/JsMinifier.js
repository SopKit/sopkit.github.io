"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check, Code, FileJs } from "lucide-react";
// We'll use a simple regex-based minifier for client-side speed without heavy libs like Terser
// unless absolutely requested. For a lightweight tool, regex is often sufficient for "compressing" whitespace.

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const minifyJs = () => {
    if (!input.trim()) return;
    
    // Very basic JS minification:
    // 1. Remove single line comments (risky with regex but okay for simple use)
    // 2. Remove multi-line comments
    // 3. Collapse whitespace
    // Note: Accurate JS minification in browser usually requires 'terser' which is heavy.
    // We will do a "safe" whitespace compression here.
    
    let minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
      .replace(/^\s*\/\/.*/gm, '') // Line comments (start of line)
       // This regex is simplistic and can break strings containing these patterns.
       // For a robust solution we'd need a parser.
       // For this "demo" level tool we will stick to conservative whitespace removal.
      .replace(/([^a-zA-Z0-9_$])\s+/g, '$1')
      .replace(/\s+([^a-zA-Z0-9_$])/g, '$1')
      .trim();
      
    setOutput(minified);
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
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <FileJs className="w-4 h-4" /> Input JavaScript
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="function hello() { console.log('world'); }"
            className="w-full h-80 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Code className="w-4 h-4" /> Output
          </label>
          <textarea
            readOnly
            value={output}
            className="w-full h-80 p-4 bg-secondary/30 border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
         <Button onClick={minifyJs} className="w-32 gap-2 bg-primary">
            <RefreshCw className="w-4 h-4" /> Minify
         </Button>
         <Button onClick={copyToClipboard} variant="secondary" className="w-32 gap-2" disabled={!output}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
         </Button>
      </div>
    
      <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm text-center">
        Note: This is a lightweight minifier. For production bundles, always use your build tool (Webpack/Vite/Bun).
      </div>
    </div>
  );
}
