"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Code as CodeIcon,
  Check,
  Copy,
  Trash2,
  Sparkles,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const DEFAULT_JSON = JSON.stringify(
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    role: "developer",
    profile: {
      avatar: "https://example.com/avatar.jpg",
      bio: "Code enthusiast",
      skills: ["React", "TypeScript", "Node.js"],
    },
    projects: [
      { id: 101, name: "SopKit Portfolio", status: "completed" },
      { id: 102, name: "Cloud Dashboard", status: "in-progress" },
    ],
  },
  null,
  2
);

export default function JsonToTypeScriptTool() {
  const [jsonInput, setJsonInput, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("json-to-ts", "input", DEFAULT_JSON);

  const [rootName, setRootName] = useToolStorage<string>(
    "json-to-ts",
    "rootName",
    "RootObject"
  );

  const [tsOutput, setTsOutput] = useState("");
  const [error, setError] = useState("");
  const { copied, copy } = useCopyFeedback();

  const convertJsonToTs = useCallback(() => {
    const text = jsonInput.trim();
    if (!text) {
      setTsOutput("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setError("");

      const interfaces: string[] = [];
      const seenNames = new Set<string>();

      const capitalize = (s: string) => {
        if (!s) return "Item";
        return s.charAt(0).toUpperCase() + s.slice(1);
      };

      const getType = (val: any, propName: string): string => {
        if (val === null) return "any";
        if (Array.isArray(val)) {
          if (val.length === 0) return "any[]";
          const elemType = getType(val[0], `${propName}Item`);
          return `${elemType}[]`;
        }
        if (typeof val === "object") {
          const subInterfaceName = capitalize(propName);
          generateInterface(val, subInterfaceName);
          return subInterfaceName;
        }
        return typeof val;
      };

      const generateInterface = (obj: any, name: string) => {
        if (seenNames.has(name) || typeof obj !== "object" || obj === null)
          return;
        seenNames.add(name);

        const lines: string[] = [];
        lines.push(`export interface ${name} {`);

        for (const [k, v] of Object.entries(obj)) {
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
            ? k
            : JSON.stringify(k);
          const t = getType(v, k);
          lines.push(`  ${safeKey}: ${t};`);
        }

        lines.push("}");
        interfaces.unshift(lines.join("\n"));
      };

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === "object") {
          generateInterface(parsed[0], capitalize(rootName || "Item"));
          setTsOutput(
            `${interfaces.join("\n\n")}\n\nexport type ${rootName}List = ${capitalize(
              rootName || "Item"
            )}[];`
          );
        } else {
          setTsOutput(`export type ${rootName} = any[];`);
        }
      } else if (typeof parsed === "object" && parsed !== null) {
        generateInterface(parsed, capitalize(rootName || "RootObject"));
        setTsOutput(interfaces.join("\n\n"));
      } else {
        setTsOutput(`export type ${rootName} = ${typeof parsed};`);
      }
    } catch (err: any) {
      setError(`Invalid JSON syntax: ${err.message || "parse failed"}`);
      setTsOutput("");
    }
  }, [jsonInput, rootName]);

  useEffect(() => {
    convertJsonToTs();
  }, [convertJsonToTs]);

  const copyToClipboard = async () => {
    if (!tsOutput) return;
    const ok = await copy(tsOutput);
    if (ok) toast.success("Copied TypeScript definitions to clipboard");
  };

  const downloadCode = () => {
    if (!tsOutput) return;
    const blob = new Blob([tsOutput], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${rootName || "types"}.d.ts`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded types file");
  };

  const clearAll = () => {
    clearStorage();
    setJsonInput("");
    setTsOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="root-interface-name"
              className="text-xs font-semibold text-muted-foreground whitespace-nowrap"
            >
              Root Name:
            </Label>
            <Input
              id="root-interface-name"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="h-7 text-xs font-mono w-36 bg-background/80"
              placeholder="RootObject"
            />
          </div>

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
            <p className="font-semibold text-destructive">Invalid JSON</p>
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
              htmlFor="json-ts-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source JSON
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {jsonInput ? `${jsonInput.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="json-ts-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[380px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Paste JSON to convert to TypeScript interfaces..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Generated TypeScript
              Types
            </Label>
            {tsOutput && (
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
                  <Download className="w-3 h-3" /> Save .d.ts
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[380px] overflow-auto select-text">
            {tsOutput ? (
              <pre className="text-foreground/90 whitespace-pre leading-relaxed text-indigo-300 dark:text-indigo-400">
                {tsOutput}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                TypeScript interfaces will be rendered here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
