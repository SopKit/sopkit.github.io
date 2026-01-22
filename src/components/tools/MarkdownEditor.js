"use client";

import React, { useState, useEffect } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { Button } from "@/components/ui/button";
import { FileText, Code, Check, Copy } from "lucide-react";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **markdown**.');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const process = async () => {
      const processedContent = await remark()
        .use(html)
        .process(markdown);
      setHtmlOutput(processedContent.toString());
    };
    process();
  }, [markdown]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6 h-[600px]">
        <div className="space-y-4 flex flex-col h-full">
           <label className="text-sm font-medium flex items-center gap-2">
             <FileText className="w-4 h-4" /> Markdown Input
           </label>
           <textarea
             value={markdown}
             onChange={(e) => setMarkdown(e.target.value)}
             className="flex-1 p-4 bg-background border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
             placeholder="# Type markdown here..."
           />
        </div>

        <div className="space-y-4 flex flex-col h-full">
           <div className="flex justify-between items-center h-5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Code className="w-4 h-4" /> HTML Preview
              </label>
           </div>
           
           <div className="flex-1 flex flex-col gap-4">
              {/* Live Preview */}
              <div 
                className="flex-1 p-4 bg-white dark:bg-slate-950 border border-border rounded-xl prose dark:prose-invert max-w-none overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
              
              {/* HTML Code Output (Hidden by default or toggle? Let's just output raw HTML string in a smaller box or copy button) */}
           </div>
        </div>
      </div>

      <div className="flex justify-center">
         <Button onClick={copyToClipboard} className="gap-2 bg-primary">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied HTML' : 'Copy HTML Code'}
         </Button>
      </div>
    </div>
  );
}
