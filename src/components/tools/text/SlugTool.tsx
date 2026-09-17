"use client";

import React, { useMemo } from "react";
import { Copy, Check, Trash2, Sparkles, Link2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { slugify } from "@sopkit/slug";
import { useToolStorage, useCopyFeedback, useRecentHistory } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const SAMPLE_TEXT = "Mastering Next.js 16 & Modern Web App Development in 2026!";

export default function SlugTool() {
  const [text, setText, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("slug-tool", "text", SAMPLE_TEXT);

  const [separator, setSeparator] = useToolStorage<string>(
    "slug-tool",
    "separator",
    "-"
  );

  const [lowercase, setLowercase] = useToolStorage<boolean>(
    "slug-tool",
    "lowercase",
    true
  );

  const [recents, pushRecent] = useRecentHistory<string>("slug-tool", "history", 5);
  const { copied, copy } = useCopyFeedback();

  const generatedSlug = useMemo(() => {
    if (!text.trim()) return "";
    try {
      const s = slugify(text, { separator, lowercase });
      return s;
    } catch {
      // Fallback
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, separator)
        .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "");
    }
  }, [text, separator, lowercase]);

  const handleCopy = async () => {
    if (!generatedSlug) return;
    const ok = await copy(generatedSlug);
    if (ok) {
      pushRecent(generatedSlug);
      toast.success("Copied URL slug to clipboard");
    }
  };

  const handleClear = () => {
    clearStorage();
    setText("");
  };

  return (
    <div className="space-y-6">
      {/* Action & Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Separator:
            </Label>
            <div className="flex items-center gap-1 p-0.5 bg-background/80 border border-border/50 rounded-lg">
              <Button
                variant={separator === "-" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeparator("-")}
                className="h-6 px-2 text-xs font-mono rounded"
              >
                Hyphen (-)
              </Button>
              <Button
                variant={separator === "_" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeparator("_")}
                className="h-6 px-2 text-xs font-mono rounded"
              >
                Underscore (_)
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Case:
            </Label>
            <div className="flex items-center gap-1 p-0.5 bg-background/80 border border-border/50 rounded-lg">
              <Button
                variant={lowercase ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLowercase(true)}
                className="h-6 px-2 text-xs rounded"
              >
                lowercase
              </Button>
              <Button
                variant={!lowercase ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLowercase(false)}
                className="h-6 px-2 text-xs rounded"
              >
                Preserve Case
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setText(SAMPLE_TEXT)}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Sample
          </Button>
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
        </div>
      </div>

      {/* Main Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="slug-source-text"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-primary" /> Source Title / String
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {text ? `${text.length} chars` : "Type or paste"}
            </span>
          </div>
          <Textarea
            id="slug-source-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="font-sans text-sm leading-relaxed border-border/50 bg-background/60 h-28 resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Type or paste post title, article heading, or product name..."
          />
        </div>

        {/* Generated Slug Result */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-primary" /> Generated URL Slug
          </Label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={generatedSlug}
              className="font-mono text-sm font-semibold text-primary bg-muted/30 border-border/50 rounded-xl h-11 px-4 select-all"
              placeholder="url-slug-will-appear-here"
            />
            <Button
              onClick={handleCopy}
              disabled={!generatedSlug}
              className="h-11 px-5 rounded-xl font-bold text-xs gap-2 shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Slug"}
            </Button>
          </div>
        </div>

        {/* Recent Slugs History */}
        {recents.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-medium text-muted-foreground block mb-2">
              Recent Slugs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recents.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setText(s.replace(new RegExp(`\\${separator}`, "g"), " "));
                    copy(s);
                    toast.success("Copied recent slug");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-muted border border-border/40 font-mono text-xs text-foreground/80 hover:text-foreground transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
