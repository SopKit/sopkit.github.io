"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Trash2, 
  RefreshCw, 
  Copy, 
  CaseSensitive, 
  Smile, 
  Languages, 
  Layout, 
  Type,
  User,
  Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function TextUtilities({ defaultTab = "case" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = (type) => {
    if (!input && type !== "random-name" && type !== "random-word") return;
    
    switch (type) {
      case "case-upper": setOutput(input.toUpperCase()); break;
      case "case-lower": setOutput(input.toLowerCase()); break;
      case "case-sentence": 
        setOutput(input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()));
        break;
      case "remove-dupes":
        const lines = input.split("\n");
        const unique = [...new Set(lines)];
        setOutput(unique.join("\n"));
        toast.success(`Removed ${lines.length - unique.length} duplicate lines`);
        break;
      case "markdown":
        // Very basic MD to HTML for demo
        let html = input
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
          .replace(/\*(.*)\*/gim, '<i>$1</i>');
        setOutput(html);
        break;
      case "emoji":
        const emojis = ["🚀", "🔥", "✨", "✅", "💡", "🎯"];
        setOutput(input.split(" ").map(w => w + " " + emojis[Math.floor(Math.random() * emojis.length)]).join(" "));
        break;
      case "random-name":
        const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley"];
        const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
        setOutput(names[Math.floor(Math.random() * names.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)]);
        break;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        setOutput("");
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="case" className="rounded-xl py-2">Case</TabsTrigger>
          <TabsTrigger value="dupes" className="rounded-xl py-2">Duplicates</TabsTrigger>
          <TabsTrigger value="markdown" className="rounded-xl py-2">Markdown</TabsTrigger>
          <TabsTrigger value="emoji" className="rounded-xl py-2">Emoji</TabsTrigger>
          <TabsTrigger value="random" className="rounded-xl py-2">Random</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader><CardTitle className="text-lg">Input Text</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste your text here..."
                  className="min-h-[250px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                
                <div className="flex flex-wrap gap-2">
                  {activeTab === "case" && (
                    <>
                      <Button onClick={() => handleAction("case-upper")} size="sm">UPPERCASE</Button>
                      <Button onClick={() => handleAction("case-lower")} size="sm" variant="outline">lowercase</Button>
                      <Button onClick={() => handleAction("case-sentence")} size="sm" variant="outline">Sentence case</Button>
                    </>
                  )}
                  {activeTab === "dupes" && (
                    <Button onClick={() => handleAction("remove-dupes")} className="w-full gap-2">
                      <Trash2 className="h-4 w-4" /> Remove Duplicate Lines
                    </Button>
                  )}
                  {activeTab === "markdown" && (
                    <Button onClick={() => handleAction("markdown")} className="w-full gap-2">
                      <Layout className="h-4 w-4" /> Convert to HTML
                    </Button>
                  )}
                  {activeTab === "emoji" && (
                    <Button onClick={() => handleAction("emoji")} className="w-full gap-2">
                      <Smile className="h-4 w-4" /> Add Emojis
                    </Button>
                  )}
                  {activeTab === "random" && (
                    <Button onClick={() => handleAction("random-name")} className="w-full gap-2">
                      <User className="h-4 w-4" /> Generate Random Name
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="h-full border-primary/20 bg-primary/5 min-h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Result</CardTitle>
                  {output && (
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {output ? (
                    <div className="h-full bg-background/50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap border overflow-y-auto max-h-[400px]">
                      {output}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-30">
                       <FileText className="h-12 w-12 mb-4" />
                       <p>Result will appear here</p>
                    </div>
                  )}
                </CardContent>
             </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
