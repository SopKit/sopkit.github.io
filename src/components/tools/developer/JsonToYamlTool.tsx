"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  FileCode,
  Loader2,
  Check,
  Copy,
  Trash2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const DEFAULT_JSON = JSON.stringify(
  {
    title: "SopKit JSON Converter",
    version: "1.0.0",
    enabled: true,
    tags: ["developer", "tools", "seo"],
    author: {
      name: "SopKit Developer",
      github: "SopKit",
    },
    services: [
      { name: "API Gateway", port: 8080 },
      { name: "Auth Service", port: 3000 },
    ],
  },
  null,
  2
);

export default function JsonToYamlTool() {
  const [jsonInput, setJsonInput, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("json-to-yaml", "input", DEFAULT_JSON);

  const [yamlOutput, setYamlOutput] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { copied, copy } = useCopyFeedback();

  const convertJson = useCallback(async () => {
    const text = jsonInput.trim();
    if (!text) {
      setYamlOutput("");
      setError("");
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const parsed = JSON.parse(text);
      const jsyaml = await import("js-yaml");
      const yamlDump = jsyaml.dump(parsed, { indent: 2, lineWidth: -1 });
      setYamlOutput(yamlDump);
    } catch (err: any) {
      setError(
        err.message || "Failed to convert JSON. Verify JSON syntax."
      );
      setYamlOutput("");
    } finally {
      setIsProcessing(false);
    }
  }, [jsonInput]);

  useEffect(() => {
    convertJson();
  }, [convertJson]);

  const copyToClipboard = async () => {
    if (!yamlOutput) return;
    const ok = await copy(yamlOutput);
    if (ok) toast.success("Copied YAML to clipboard");
  };

  const downloadCode = () => {
    if (!yamlOutput) return;
    const blob = new Blob([yamlOutput], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.yaml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded output.yaml");
  };

  const clearAll = () => {
    clearStorage();
    setJsonInput("");
    setYamlOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setJsonInput(DEFAULT_JSON)}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Load Sample
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={clearAll}
          />
          {jsonInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3.5 border border-destructive/30 bg-destructive/10 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-destructive">Invalid JSON Syntax</p>
            <p className="text-muted-foreground font-mono text-[11px]">{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="json-yaml-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source JSON
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {jsonInput ? `${jsonInput.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="json-yaml-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[380px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Paste JSON to convert to YAML..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> YAML Output
            </Label>
            {yamlOutput && (
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
                  onClick={downloadCode}
                  className="h-6 text-[10px] font-mono gap-1 px-2 rounded-md"
                >
                  <Download className="w-3 h-3" /> Save .yaml
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[380px] overflow-auto select-text">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Converting to YAML...</span>
              </div>
            ) : yamlOutput ? (
              <pre className="text-foreground/90 whitespace-pre leading-relaxed text-amber-300 dark:text-amber-400">
                {yamlOutput}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                YAML output will be rendered here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
