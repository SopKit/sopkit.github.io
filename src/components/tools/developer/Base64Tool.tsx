"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Check,
  Copy,
  Trash2,
  Sparkles,
  AlertCircle,
  FileCode,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export default function Base64Tool({
  initialMode = "encode",
}: {
  initialMode?: "encode" | "decode";
}) {
  const [mode, setMode, { clearStorage: clearModeStorage }] = useToolStorage<
    "encode" | "decode" | "file-encode"
  >("base64", "mode", initialMode);

  const [input, setInput, { isSaved, hasStoredValue, clearStorage: clearInputStorage }] =
    useToolStorage<string>(
      "base64",
      "input",
      initialMode === "decode"
        ? "U29wS2l0IC0gUHJpdmFjeS1maXJzdCBkZXZlbG9wZXIgdG9vbHMh"
        : "SopKit - Privacy-first developer tools!"
    );

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyFeedback();

  const processText = useCallback(
    (textStr: string, operation: "encode" | "decode") => {
      try {
        setError("");
        if (!textStr) {
          setOutput("");
          return;
        }

        if (operation === "encode") {
          const encoded = btoa(unescape(encodeURIComponent(textStr)));
          setOutput(encoded);
        } else {
          const decoded = decodeURIComponent(escape(atob(textStr.trim())));
          setOutput(decoded);
        }
      } catch (err: any) {
        setError(
          `Invalid Base64 string for decoding: ${err.message || "malformed payload"}`
        );
        setOutput("");
      }
    },
    []
  );

  useEffect(() => {
    if (mode !== "file-encode") {
      processText(input, mode);
    }
  }, [input, mode, processText]);

  const handleModeChange = (newMode: "encode" | "decode" | "file-encode") => {
    setMode(newMode);
    setError("");
    setFileInfo(null);
    if (newMode === "encode") {
      setInput("SopKit - 100% private developer tools!");
    } else if (newMode === "decode") {
      setInput("U29wS2l0IC0gMTAwJSBwcml2YXRlIGRldmVsb3BlciB0b29scyE=");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.includes(",") ? result.split(",")[1] : result;
      setInput(`// File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setOutput(base64Data);
      toast.success(`Encoded "${file.name}" to Base64`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const copyToClipboard = async () => {
    if (!output) return;
    const ok = await copy(output);
    if (ok) toast.success("Copied output to clipboard");
  };

  const downloadResult = () => {
    if (!output) return;
    const isEncoded = mode === "encode" || mode === "file-encode";
    const filename = isEncoded ? "base64-encoded.txt" : "decoded-output.txt";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const clearAll = () => {
    clearInputStorage();
    setInput("");
    setOutput("");
    setError("");
    setFileInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-1.5 p-1 bg-background/80 border border-border/50 rounded-lg">
          <Button
            variant={mode === "encode" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleModeChange("encode")}
            className="h-7 text-xs font-semibold rounded-md"
          >
            Encode Text
          </Button>
          <Button
            variant={mode === "decode" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleModeChange("decode")}
            className="h-7 text-xs font-semibold rounded-md"
          >
            Decode Base64
          </Button>
          <Button
            variant={mode === "file-encode" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleModeChange("file-encode")}
            className="h-7 text-xs font-semibold rounded-md"
          >
            Encode File
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={clearAll}
          />
          {input && (
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
            <p className="font-semibold text-destructive">Invalid Base64 Payload</p>
            <p className="text-muted-foreground font-mono text-[11px]">{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="base64-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" />
              {mode === "encode"
                ? "Plain Text String"
                : mode === "decode"
                ? "Base64 Encoded String"
                : "Source File"}
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {input ? `${input.length} chars` : "Empty"}
            </span>
          </div>

          {mode === "file-encode" ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/70 hover:border-primary/50 bg-background/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all h-[340px] text-center"
              >
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Drop file or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, PDF, SVG, WebP, Audio (Processed 100% locally in browser)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>

              {fileInfo && (
                <div className="p-3 bg-muted/20 border border-border/40 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-mono text-foreground font-medium">
                    {fileInfo.name}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {(fileInfo.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Textarea
              id="base64-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[340px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
              placeholder={
                mode === "encode"
                  ? "Type or paste text to encode..."
                  : "Paste Base64 string to decode..."
              }
              spellCheck={false}
            />
          )}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {mode === "encode" || mode === "file-encode"
                ? "Base64 Output"
                : "Decoded Plain Text"}
            </Label>
            {output && (
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
                  onClick={downloadResult}
                  className="h-6 text-[10px] font-mono gap-1 px-2 rounded-md"
                >
                  <Download className="w-3 h-3" /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[340px] overflow-auto select-text break-all">
            {output ? (
              <pre className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                Result will appear here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
