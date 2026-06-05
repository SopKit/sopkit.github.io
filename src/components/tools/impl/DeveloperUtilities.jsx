"use client";

import React, { useState, useCallback } from "react";
import { 
  Code, 
  Terminal, 
  Database, 
  FileJson, 
  Globe, 
  Shield, 
  Copy, 
  RefreshCw, 
  Zap,
  Check,
  Search,
  Type
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function DeveloperUtilities({ defaultTab = "uuid" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- JWT Decoder ---
  const decodeJwt = () => {
    if (!input) return;
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setOutput(JSON.stringify({ header, payload }, null, 2));
      toast.success("JWT Decoded!");
    } catch (e) {
      toast.error("Invalid JWT token");
    }
  };

  // --- UUID Generator ---
  const generateUuid = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setOutput(uuid);
    toast.success("UUID Generated!");
  };

  // --- Slug Generator ---
  const generateSlug = () => {
    if (!input) return;
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setOutput(slug);
    toast.success("Slug Created!");
  };

  // --- HTML Entity Encoder ---
  const handleHtmlEntity = (mode) => {
    if (!input) return;
    if (mode === 'encode') {
      setOutput(input.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`));
    } else {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      setOutput(doc.documentElement.textContent);
    }
  };

  // --- Binary to Hex ---
  const handleBinaryHex = (mode) => {
    if (!input) return;
    try {
      if (mode === 'bin2hex') {
        const hex = parseInt(input, 2).toString(16).toUpperCase();
        setOutput(hex);
      } else {
        const bin = parseInt(input, 16).toString(2);
        setOutput(bin);
      }
    } catch (e) {
      toast.error("Invalid input for conversion");
    }
  };

  // --- Text Reverser (Moving from Text batch for efficiency) ---
  const reverseText = () => {
     setOutput(input.split("").reverse().join(""));
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
        setInput("");
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="uuid" className="rounded-xl py-2">UUID</TabsTrigger>
          <TabsTrigger value="slug" className="rounded-xl py-2">Slug</TabsTrigger>
          <TabsTrigger value="html" className="rounded-xl py-2">HTML Entity</TabsTrigger>
          <TabsTrigger value="binhex" className="rounded-xl py-2">Binary/Hex</TabsTrigger>
          <TabsTrigger value="jwt" className="rounded-xl py-2">JWT</TabsTrigger>
          <TabsTrigger value="reverse" className="rounded-xl py-2">Reverse</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTab !== "uuid" && (
                  <Textarea 
                    placeholder={activeTab === "jwt" ? "Paste JWT here..." : "Enter your data here..."}
                    className="min-h-[200px] font-mono text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
                
                <div className="flex flex-wrap gap-2">
                  {activeTab === "uuid" && (
                    <Button onClick={generateUuid} className="w-full h-12 gap-2">
                      <RefreshCw className="h-4 w-4" /> Generate UUID v4
                    </Button>
                  )}
                  {activeTab === "jwt" && (
                    <Button onClick={decodeJwt} className="w-full h-12 gap-2" disabled={!input}>
                      <Shield className="h-4 w-4" /> Decode JWT
                    </Button>
                  )}
                  {activeTab === "slug" && (
                    <Button onClick={generateSlug} className="w-full h-12 gap-2" disabled={!input}>
                      <Zap className="h-4 w-4" /> Create Slug
                    </Button>
                  )}
                  {activeTab === "html" && (
                    <>
                      <Button onClick={() => handleHtmlEntity('encode')} className="flex-1" disabled={!input}>Encode</Button>
                      <Button onClick={() => handleHtmlEntity('decode')} variant="outline" className="flex-1" disabled={!input}>Decode</Button>
                    </>
                  )}
                  {activeTab === "binhex" && (
                    <>
                      <Button onClick={() => handleBinaryHex('bin2hex')} className="flex-1" disabled={!input}>Bin to Hex</Button>
                      <Button onClick={() => handleBinaryHex('hex2bin')} variant="outline" className="flex-1" disabled={!input}>Hex to Bin</Button>
                    </>
                  )}
                  {activeTab === "reverse" && (
                    <Button onClick={reverseText} className="w-full h-12" disabled={!input}>Reverse Text</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5 h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Output</CardTitle>
                {output && (
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {output ? (
                  <div className="h-full bg-background/50 rounded-xl p-4 font-mono text-sm break-all border overflow-y-auto max-h-[300px]">
                    {output}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 border border-dashed rounded-xl">
                    <Code className="h-8 w-8 mb-2" />
                    <p className="text-xs">Results will appear here.</p>
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
