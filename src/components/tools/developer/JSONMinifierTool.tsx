"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  FileJson,
  Check,
  Copy,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const SAMPLE_JSON = `{
  "platform": "SopKit",
  "version": "2.0.0",
  "privacy": {
    "zeroUploads": true,
    "localExecution": true
  },
  "features": [
    "JSON Minifier",
    "JWT Debugger",
    "Base64 Codec",
    "URL Formatter"
  ]
}`;

export default function JSONMinifierTool() {
  const [jsonInput, setJsonInput, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("json-minifier", "input", SAMPLE_JSON);

  const [minifiedJson, setMinifiedJson] = useState<string>("");
  const [stats, setStats] = useState<{
    original: number;
    minified: number;
    ratio: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyFeedback();

  // Auto-minify on change
  useEffect(() => {
    if (!jsonInput.trim()) {
      setMinifiedJson("");
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setMinifiedJson(minified);

      const originalSize = new Blob([jsonInput]).size;
      const minifiedSize = new Blob([minified]).size;
      const ratio =
        originalSize > 0
          ? Math.round((1 - minifiedSize / originalSize) * 100)
          : 0;

      setStats({
        original: originalSize,
        minified: minifiedSize,
        ratio: Math.max(0, ratio),
      });
    } catch {
      // Keep previous minified or clear stats if syntax error
      setStats(null);
    }
  }, [jsonInput]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setJsonInput(content);
      toast.success(`Loaded "${file.name}"`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const copyToClipboard = async () => {
    if (!minifiedJson) return;
    const ok = await copy(minifiedJson);
    if (ok) toast.success("Copied minified JSON to clipboard");
  };

  const downloadJSON = () => {
    if (!minifiedJson) return;
    const blob = new Blob([minifiedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "minified.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded minified.json");
  };

  const clearInput = () => {
    clearStorage();
    setJsonInput("");
    setMinifiedJson("");
    setStats(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload File
          </Button>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Load Sample
          </Button>

          {stats && stats.ratio > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-medium">
              <Zap className="w-3 h-3" /> Saved {stats.ratio}% (
              {formatFileSize(stats.original)} → {formatFileSize(stats.minified)})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={clearInput}
          />
          {jsonInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearInput}
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="json-source-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileJson className="w-3.5 h-3.5 text-primary" /> Source JSON
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {jsonInput ? `${jsonInput.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="json-source-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[360px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Paste raw JSON here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Compact Minified JSON
            </Label>
            {minifiedJson && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 text-[10px] font-mono gap-1 px-2 rounded-md"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadJSON}
                  className="h-6 text-[10px] font-mono gap-1 px-2 rounded-md"
                >
                  <Download className="w-3 h-3" /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[360px] overflow-auto select-text break-all">
            {minifiedJson ? (
              <pre className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {minifiedJson}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                Minified JSON will appear here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
