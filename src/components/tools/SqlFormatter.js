"use client";

import React, { useState } from 'react';
import { format } from 'sql-formatter';
import { Button } from "@/components/ui/button";
import { Database, Copy, RefreshCw, Check, Code } from "lucide-react";

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('sql');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const formatSql = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      const formatted = format(input, {
        language: language,
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
    } catch (err) {
      setError("Failed to format SQL. Check syntax.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
               <Database className="w-4 h-4" /> Input Query
             </label>
             <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-background border border-border rounded-md text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
             >
                <option value="sql">Standard SQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="bigquery">BigQuery</option>
             </select>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE id = 1"
            className="flex-1 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        <div className="space-y-4 flex flex-col h-full">
          <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Code className="w-4 h-4" /> Formatted Output
          </label>
          <div className="relative flex-1">
             <textarea
              readOnly
              value={output}
              className="w-full h-full p-4 bg-secondary/30 border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                 <p className="text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
         <Button onClick={formatSql} className="w-32 gap-2 bg-primary">
            <RefreshCw className="w-4 h-4" /> Format
         </Button>
         <Button onClick={copyToClipboard} variant="secondary" className="w-32 gap-2" disabled={!output}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
         </Button>
      </div>
    </div>
  );
}
