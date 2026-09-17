"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Code as CodeIcon,
  Check,
  Copy,
  Trash2,
  Sparkles,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const DEFAULT_HTML = `<h1>Hello World! & Welcome to "SopKit" & 'Tools' <script>alert("safe")</script></h1>`;

export default function HtmlEntityCodecTool() {
  const [inputText, setInputText, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("html-codec", "input", DEFAULT_HTML);

  const [mode, setMode] = useToolStorage<"encode" | "decode">(
    "html-codec",
    "mode",
    "encode"
  );

  const [entityType, setEntityType] = useToolStorage<"named" | "numeric">(
    "html-codec",
    "entityType",
    "named"
  );

  const [outputText, setOutputText] = useState("");
  const { copied, copy } = useCopyFeedback();

  const encodeHtml = useCallback(
    (str: string): string => {
      if (entityType === "numeric") {
        return str.replace(
          /[\u00A0-\u9999<>&"']/g,
          (i) => `&#${i.charCodeAt(0)};`
        );
      } else {
        const map: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "/": "&#x2F;",
        };
        return str.replace(/[&<>"'/]/g, (s) => map[s] || s);
      }
    },
    [entityType]
  );

  const decodeHtml = useCallback((str: string): string => {
    if (typeof document === "undefined") return str;
    const temp = document.createElement("textarea");
    temp.innerHTML = str;
    return temp.value;
  }, []);

  useEffect(() => {
    const text = inputText;
    if (!text) {
      setOutputText("");
      return;
    }

    if (mode === "encode") {
      setOutputText(encodeHtml(text));
    } else {
      setOutputText(decodeHtml(text));
    }
  }, [inputText, mode, entityType, encodeHtml, decodeHtml]);

  const copyToClipboard = async () => {
    if (!outputText) return;
    const ok = await copy(outputText);
    if (ok) toast.success("Copied HTML output to clipboard");
  };

  const downloadCode = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "encode" ? "encoded.html" : "decoded.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded file");
  };

  const clearAll = () => {
    clearStorage();
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-background/80 border border-border/50 rounded-lg">
            <Button
              variant={mode === "encode" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMode("encode")}
              className="h-7 text-xs font-semibold rounded-md"
            >
              Encode Entities
            </Button>
            <Button
              variant={mode === "decode" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMode("decode")}
              className="h-7 text-xs font-semibold rounded-md"
            >
              Decode Entities
            </Button>
          </div>

          {mode === "encode" && (
            <div className="flex items-center gap-1.5 p-1 bg-background/80 border border-border/50 rounded-lg">
              <Button
                variant={entityType === "named" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEntityType("named")}
                className="h-7 text-xs font-semibold rounded-md"
              >
                Named (&amp;amp;)
              </Button>
              <Button
                variant={entityType === "numeric" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEntityType("numeric")}
                className="h-7 text-xs font-semibold rounded-md"
              >
                Numeric (&amp;#38;)
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputText(DEFAULT_HTML)}
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
          {inputText && (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="html-codec-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source Content
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {inputText ? `${inputText.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="html-codec-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[380px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder={
              mode === "encode"
                ? "Type HTML to encode entities..."
                : "Paste HTML entities (e.g. &lt;h1&gt;) to decode..."
            }
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Converted Output
            </Label>
            {outputText && (
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
                  <Download className="w-3 h-3" /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[380px] overflow-auto select-text break-all">
            {outputText ? (
              <pre className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {outputText}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                Converted HTML output will appear here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
