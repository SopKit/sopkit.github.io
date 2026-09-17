"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowDownUp,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  Check,
  Copy,
  Trash2,
  Type,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

type Mode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "alternating"
  | "inverse";

const SAMPLE_TEXT =
  "the quick brown fox jumps over the lazy dog. modern web development with SopKit is fast, secure, and privacy-first.";

export default function CaseConverter() {
  const [inputText, setInputText, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("case-converter", "text", SAMPLE_TEXT);

  const [mode, setMode] = useToolStorage<Mode | null>(
    "case-converter",
    "mode",
    "title"
  );

  const [outputText, setOutputText] = useState("");
  const { copied, copy } = useCopyFeedback();

  const transform = useCallback((text: string, type: Mode | null) => {
    if (!text || !type) return text;
    switch (type) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "title":
        return text
          .toLowerCase()
          .split(/(\s+)/)
          .map((word) =>
            word.length > 0
              ? word.charAt(0).toUpperCase() + word.slice(1)
              : word
          )
          .join("");
      case "sentence":
        return text
          .toLowerCase()
          .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) =>
            match.toUpperCase()
          );
      case "alternating":
        return text
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join("");
      case "inverse":
        return text
          .split("")
          .map((c) =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
          )
          .join("");
      default:
        return text;
    }
  }, []);

  useEffect(() => {
    setOutputText(transform(inputText, mode));
  }, [inputText, mode, transform]);

  const copyToClipboard = async () => {
    if (!outputText) return;
    const ok = await copy(outputText);
    if (ok) toast.success("Copied converted text to clipboard!");
  };

  const clearText = () => {
    clearStorage();
    setInputText("");
    setMode(null);
    toast.info("Cleared text");
  };

  const handleModeClick = (newMode: Mode) => {
    setMode(newMode);
    toast.info(`Converted to ${newMode.replace("-", " ")}`);
  };

  const modes = [
    { id: "upper", label: "UPPER CASE", icon: CaseUpper },
    { id: "lower", label: "lower case", icon: CaseLower },
    { id: "title", label: "Title Case", icon: CaseSensitive },
    { id: "sentence", label: "Sentence case", icon: Type },
    { id: "alternating", label: "aLtErNaTiNg", icon: ArrowDownUp },
    { id: "inverse", label: "InVeRsE cAsE", icon: ArrowDownUp },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {modes.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeClick(m.id as Mode)}
            className={cn(
              "h-10 text-xs font-semibold rounded-xl transition-all duration-200 gap-1.5",
              mode === m.id ? "shadow-sm scale-[1.02]" : "hover:border-primary/50"
            )}
          >
            <span className="truncate">{m.label}</span>
          </Button>
        ))}
      </div>

      {/* Editor & Action Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-2.5 sm:p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText(SAMPLE_TEXT)}
              className="h-7 text-xs font-semibold rounded-lg"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Sample
            </Button>
            {mode && (
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                Active: <strong className="text-foreground capitalize">{mode}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ToolAutoSaveIndicator
              isSaved={isSaved}
              hasStoredValue={hasStoredValue}
              onClear={clearText}
            />
            {inputText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearText}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
              </Button>
            )}
            <Button
              onClick={copyToClipboard}
              disabled={!outputText}
              size="sm"
              className="h-7 text-xs font-semibold rounded-lg gap-1.5 px-3"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          </div>
        </div>

        {/* Text Area */}
        <Textarea
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInputText(e.target.value)
          }
          placeholder="Type or paste your text here..."
          className="min-h-[300px] text-base p-4 sm:p-6 bg-background/60 border-border/50 focus-visible:ring-primary/30 rounded-xl transition-all resize-none shadow-xs font-sans leading-relaxed"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl text-center">
          <span className="text-xl font-bold text-foreground block">
            {inputText.length}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Characters
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl text-center">
          <span className="text-xl font-bold text-foreground block">
            {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Words
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl text-center">
          <span className="text-xl font-bold text-foreground block">
            {inputText.split("\n").filter((l) => l.trim()).length}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Lines
          </span>
        </div>
      </div>
    </div>
  );
}
