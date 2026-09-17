"use client";

import React, { useMemo } from "react";
import { Copy, Check, Trash2, Sparkles, Clock, Mic, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const SAMPLE_ESSAY = `SopKit is an open-source, client-side developer and creator platform. Every tool runs 100% locally in your web browser with zero server uploads, tracking, or subscription paywalls.

Whether you are minifying JSON, inspecting a JSON Web Token, generating cryptographic hashes, or writing essays, your data remains strictly private. With local browser storage persistence, you can close your tab or return days later without losing your work.`;

export default function WordCounterTool() {
  const [text, setText, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("word-counter", "text", SAMPLE_ESSAY);

  const { copied, copy } = useCopyFeedback();

  const stats = useMemo(() => {
    const trimmed = (text || "").trim();
    const words = trimmed
      ? trimmed.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w))
      : [];
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0;
    const avgLen = words.length
      ? (charsNoSpace / words.length).toFixed(1)
      : "0";

    const readingTimeMinutes = Math.ceil(words.length / 225);
    const speakingTimeMinutes = Math.ceil(words.length / 130);

    return {
      words: words.length,
      chars,
      charsNoSpace,
      lines,
      sentences,
      paragraphs,
      avgLen,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copy(text);
    if (ok) toast.success("Copied text to clipboard");
  };

  const handleClear = () => {
    clearStorage();
    setText("");
    toast.info("Cleared text");
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setText(SAMPLE_ESSAY)}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Sample Essay
          </Button>

          <span className="text-xs text-muted-foreground font-mono ml-2">
            Reading time: ~{stats.readingTimeMinutes} min • Speaking: ~
            {stats.speakingTimeMinutes} min
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={handleClear}
          />
          {text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
          <Button
            onClick={handleCopy}
            disabled={!text}
            size="sm"
            className="h-7 text-xs font-semibold rounded-lg gap-1.5 px-3"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="word-count-textarea"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <AlignLeft className="w-3.5 h-3.5 text-primary" /> Document Content
          </Label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {stats.words} words • {stats.chars} characters
          </span>
        </div>

        <Textarea
          id="word-count-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text, essays, articles, or scripts..."
          className="min-h-[280px] sm:min-h-[340px] text-base p-4 sm:p-6 bg-background/60 border-border/50 focus-visible:ring-primary/30 rounded-xl leading-relaxed resize-none shadow-xs font-sans"
        />
      </div>

      {/* Comprehensive Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-2xl font-extrabold text-foreground block">
            {stats.words.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Total Words
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-2xl font-extrabold text-foreground block">
            {stats.chars.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Characters (with spaces)
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-2xl font-extrabold text-foreground block">
            {stats.charsNoSpace.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Characters (no spaces)
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-2xl font-extrabold text-foreground block">
            {stats.sentences.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Sentences
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-xl font-bold text-foreground block">
            {stats.paragraphs.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Paragraphs
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-xl font-bold text-foreground block">
            {stats.lines.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Lines
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-xl font-bold text-foreground block">
            {stats.avgLen}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Avg Word Length
          </span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
          <span className="text-xl font-bold text-primary block flex items-center gap-1">
            <Clock className="w-4 h-4" /> ~{stats.readingTimeMinutes}m
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Reading Time
          </span>
        </div>
      </div>
    </div>
  );
}
