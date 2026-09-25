"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Copy,
  Trash2,
  Download,
  Check,
  ArrowRightLeft,
  Sparkles,
  ClipboardPaste,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ToolShell,
  ToolGrid,
  ToolPanel,
  ToolSectionTitle,
} from "@/components/tools/shared/design-system";
import { useToolStorage } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

export type BaseConverterKind =
  | "ascii-to-binary"
  | "binary-to-text"
  | "binary-to-decimal"
  | "binary-to-hex"
  | "binary-to-octal"
  | "decimal-to-text"
  | "ascii-to-text"
  | "decimal-to-hex"
  | "binary-to-ascii"
  | "decimal-to-binary"
  | "decimal-to-octal"
  | "text-to-binary"
  | "text-to-hex"
  | "text-to-octal"
  | "text-to-decimal"
  | "text-to-ascii"
  | "hex-to-text"
  | "hex-to-binary"
  | "hex-to-decimal"
  | "hex-to-octal"
  | "octal-to-text"
  | "octal-to-binary"
  | "octal-to-decimal"
  | "octal-to-hex";

type DelimiterType = "space" | "none" | "comma" | "newline";

interface BaseConverterProps {
  title?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  converterKind: BaseConverterKind;
  onCopy?: (text: string) => void;
  onClear?: () => void;
  onDownload?: (text: string) => void;
  autoConvert?: boolean;
}

const KIND_METADATA: Record<
  BaseConverterKind,
  {
    inputTitle: string;
    outputTitle: string;
    inputDesc: string;
    outputDesc: string;
    sample: string;
    isTextInput: boolean;
    isTextOutput: boolean;
  }
> = {
  "ascii-to-binary": {
    inputTitle: "ASCII Text",
    outputTitle: "8-Bit Binary",
    inputDesc: "Plain text characters",
    outputDesc: "8-bit binary representation per character",
    sample: "Hello World",
    isTextInput: true,
    isTextOutput: false,
  },
  "binary-to-ascii": {
    inputTitle: "Binary Stream",
    outputTitle: "ASCII Text",
    inputDesc: "Binary octets (e.g. 01001000 01100101)",
    outputDesc: "Decoded ASCII characters",
    sample: "01001000 01100101 01101100 01101100 01101111",
    isTextInput: false,
    isTextOutput: true,
  },
  "ascii-to-text": {
    inputTitle: "ASCII Decimal Codes",
    outputTitle: "Plain Text",
    inputDesc: "Base-10 character numbers (e.g. 72 101 108 108 111)",
    outputDesc: "Decoded text string",
    sample: "72 101 108 108 111 32 87 111 114 108 100",
    isTextInput: false,
    isTextOutput: true,
  },
  "text-to-ascii": {
    inputTitle: "Plain Text",
    outputTitle: "ASCII Decimal Codes",
    inputDesc: "Plain text characters",
    outputDesc: "Decimal ASCII values (base-10)",
    sample: "Hello World",
    isTextInput: true,
    isTextOutput: false,
  },
  "binary-to-text": {
    inputTitle: "Binary Bytes",
    outputTitle: "Plain Text",
    inputDesc: "8-bit binary byte sequences",
    outputDesc: "Decoded plain text",
    sample: "01010011 01101111 01110000 01001011 01101001 01110100",
    isTextInput: false,
    isTextOutput: true,
  },
  "text-to-binary": {
    inputTitle: "Plain Text",
    outputTitle: "Binary Octets",
    inputDesc: "Plain text characters",
    outputDesc: "8-bit binary values",
    sample: "SopKit",
    isTextInput: true,
    isTextOutput: false,
  },
  "binary-to-decimal": {
    inputTitle: "Binary Numbers",
    outputTitle: "Decimal Numbers",
    inputDesc: "Base-2 binary integers",
    outputDesc: "Base-10 decimal integers",
    sample: "1010 1100 1111 10000 100000",
    isTextInput: false,
    isTextOutput: false,
  },
  "decimal-to-binary": {
    inputTitle: "Decimal Numbers",
    outputTitle: "Binary Numbers",
    inputDesc: "Base-10 integer values",
    outputDesc: "Base-2 binary representations",
    sample: "10 42 128 255 1024",
    isTextInput: false,
    isTextOutput: false,
  },
  "binary-to-hex": {
    inputTitle: "Binary Numbers",
    outputTitle: "Hexadecimal Bytes",
    inputDesc: "Base-2 binary sequences",
    outputDesc: "Base-16 hex values",
    sample: "11111111 10101010 01010101 00110011",
    isTextInput: false,
    isTextOutput: false,
  },
  "hex-to-binary": {
    inputTitle: "Hexadecimal Bytes",
    outputTitle: "Binary Bytes",
    inputDesc: "Base-16 hex digits (e.g. FF AA 55)",
    outputDesc: "8-bit binary values",
    sample: "FF AA 55 42",
    isTextInput: false,
    isTextOutput: false,
  },
  "binary-to-octal": {
    inputTitle: "Binary Numbers",
    outputTitle: "Octal Values",
    inputDesc: "Base-2 binary sequences",
    outputDesc: "Base-8 octal values",
    sample: "11111111 10101010 01111111",
    isTextInput: false,
    isTextOutput: false,
  },
  "octal-to-binary": {
    inputTitle: "Octal Values",
    outputTitle: "Binary Values",
    inputDesc: "Base-8 octal values (0-7)",
    outputDesc: "Base-2 binary digits",
    sample: "377 252 77",
    isTextInput: false,
    isTextOutput: false,
  },
  "decimal-to-text": {
    inputTitle: "Decimal Character Codes",
    outputTitle: "Plain Text",
    inputDesc: "ASCII/Unicode decimal codepoints",
    outputDesc: "Decoded text characters",
    sample: "83 111 112 75 105 116",
    isTextInput: false,
    isTextOutput: true,
  },
  "text-to-decimal": {
    inputTitle: "Plain Text",
    outputTitle: "Decimal Codes",
    inputDesc: "Plain text characters",
    outputDesc: "Decimal codepoint values",
    sample: "SopKit",
    isTextInput: true,
    isTextOutput: false,
  },
  "decimal-to-hex": {
    inputTitle: "Decimal Numbers",
    outputTitle: "Hexadecimal Values",
    inputDesc: "Base-10 integer numbers",
    outputDesc: "Base-16 hex numbers",
    sample: "255 128 42 16 1024",
    isTextInput: false,
    isTextOutput: false,
  },
  "hex-to-decimal": {
    inputTitle: "Hexadecimal Values",
    outputTitle: "Decimal Numbers",
    inputDesc: "Base-16 hex numbers (e.g. FF 80 2A)",
    outputDesc: "Base-10 decimal numbers",
    sample: "FF 80 2A 10 400",
    isTextInput: false,
    isTextOutput: false,
  },
  "decimal-to-octal": {
    inputTitle: "Decimal Numbers",
    outputTitle: "Octal Values",
    inputDesc: "Base-10 integer numbers",
    outputDesc: "Base-8 octal values",
    sample: "255 128 64 32",
    isTextInput: false,
    isTextOutput: false,
  },
  "octal-to-decimal": {
    inputTitle: "Octal Values",
    outputTitle: "Decimal Numbers",
    inputDesc: "Base-8 octal values (0-7)",
    outputDesc: "Base-10 decimal numbers",
    sample: "377 200 100 40",
    isTextInput: false,
    isTextOutput: false,
  },
  "hex-to-text": {
    inputTitle: "Hexadecimal Bytes",
    outputTitle: "Plain Text",
    inputDesc: "Hex byte pairs (e.g. 53 6F 70 4B 69 74 or 536F704B6974)",
    outputDesc: "Decoded text string",
    sample: "53 6F 70 4B 69 74",
    isTextInput: false,
    isTextOutput: true,
  },
  "text-to-hex": {
    inputTitle: "Plain Text",
    outputTitle: "Hexadecimal Bytes",
    inputDesc: "Plain text characters",
    outputDesc: "2-digit uppercase hex bytes",
    sample: "SopKit",
    isTextInput: true,
    isTextOutput: false,
  },
  "hex-to-octal": {
    inputTitle: "Hexadecimal Values",
    outputTitle: "Octal Values",
    inputDesc: "Base-16 hex numbers",
    outputDesc: "Base-8 octal numbers",
    sample: "FF A0 7F 3B",
    isTextInput: false,
    isTextOutput: false,
  },
  "octal-to-hex": {
    inputTitle: "Octal Values",
    outputTitle: "Hexadecimal Values",
    inputDesc: "Base-8 octal numbers",
    outputDesc: "Base-16 hex numbers",
    sample: "377 240 177 73",
    isTextInput: false,
    isTextOutput: false,
  },
  "octal-to-text": {
    inputTitle: "Octal Codes",
    outputTitle: "Plain Text",
    inputDesc: "Octal byte values (e.g. 123 157 160)",
    outputDesc: "Decoded plain text",
    sample: "123 157 160 113 151 164",
    isTextInput: false,
    isTextOutput: true,
  },
  "text-to-octal": {
    inputTitle: "Plain Text",
    outputTitle: "Octal Codes",
    inputDesc: "Plain text characters",
    outputDesc: "3-digit octal codes per character",
    sample: "SopKit",
    isTextInput: true,
    isTextOutput: false,
  },
};

const RECIPROCAL_MAP: Partial<
  Record<BaseConverterKind, { kind: BaseConverterKind; label: string }>
> = {
  "ascii-to-binary": { kind: "binary-to-ascii", label: "Binary to ASCII" },
  "binary-to-ascii": { kind: "ascii-to-binary", label: "ASCII to Binary" },
  "ascii-to-text": { kind: "text-to-ascii", label: "Text to ASCII" },
  "text-to-ascii": { kind: "ascii-to-text", label: "ASCII to Text" },
  "binary-to-text": { kind: "text-to-binary", label: "Text to Binary" },
  "text-to-binary": { kind: "binary-to-text", label: "Binary to Text" },
  "binary-to-decimal": { kind: "decimal-to-binary", label: "Decimal to Binary" },
  "decimal-to-binary": { kind: "binary-to-decimal", label: "Binary to Decimal" },
  "binary-to-hex": { kind: "hex-to-binary", label: "Hex to Binary" },
  "hex-to-binary": { kind: "binary-to-hex", label: "Binary to Hex" },
  "binary-to-octal": { kind: "octal-to-binary", label: "Octal to Binary" },
  "octal-to-binary": { kind: "binary-to-octal", label: "Binary to Octal" },
  "decimal-to-text": { kind: "text-to-decimal", label: "Text to Decimal" },
  "text-to-decimal": { kind: "decimal-to-text", label: "Decimal to Text" },
  "decimal-to-hex": { kind: "hex-to-decimal", label: "Hex to Decimal" },
  "hex-to-decimal": { kind: "decimal-to-hex", label: "Decimal to Hex" },
  "decimal-to-octal": { kind: "octal-to-decimal", label: "Octal to Decimal" },
  "octal-to-decimal": { kind: "decimal-to-octal", label: "Decimal to Octal" },
  "hex-to-text": { kind: "text-to-hex", label: "Text to Hex" },
  "text-to-hex": { kind: "hex-to-text", label: "Hex to Text" },
  "hex-to-octal": { kind: "octal-to-hex", label: "Octal to Hex" },
  "octal-to-hex": { kind: "hex-to-octal", label: "Hex to Octal" },
  "octal-to-text": { kind: "text-to-octal", label: "Text to Octal" },
  "text-to-octal": { kind: "octal-to-text", label: "Octal to Text" },
};

function splitTokens(input: string): string[] {
  return input.trim().split(/[\s,]+/).filter(Boolean);
}

function hexByteTokens(input: string): string[] {
  const compact = input.replace(/\s+/g, "").replace(/^0x/gi, "");
  if (!compact) return [];
  if (input.includes(" ") || input.includes(",")) {
    return splitTokens(input).map((t) => t.replace(/^0x/gi, ""));
  }
  const pairs: string[] = [];
  for (let i = 0; i < compact.length; i += 2) {
    pairs.push(compact.slice(i, i + 2));
  }
  return pairs.filter((p) => p.length > 0);
}

function parseBinaryTokens(input: string): string[] {
  const trimmed = input.trim();
  if (trimmed.includes(" ") || trimmed.includes(",") || trimmed.includes("\n")) {
    return splitTokens(trimmed).map((t) => t.replace(/^0b/gi, ""));
  }
  const chunks: string[] = [];
  for (let i = 0; i < trimmed.length; i += 8) {
    chunks.push(trimmed.slice(i, i + 8));
  }
  return chunks.filter(Boolean);
}

function joinTokens(tokens: string[], delimiter: DelimiterType): string {
  switch (delimiter) {
    case "none":
      return tokens.join("");
    case "comma":
      return tokens.join(", ");
    case "newline":
      return tokens.join("\n");
    case "space":
    default:
      return tokens.join(" ");
  }
}

function convertByKind(
  kind: BaseConverterKind,
  input: string,
  delimiter: DelimiterType
): string {
  if (!input.trim()) return "";

  switch (kind) {
    case "binary-to-text":
    case "binary-to-ascii": {
      const tokens = parseBinaryTokens(input);
      return tokens
        .map((bin) => {
          const num = parseInt(bin, 2);
          return Number.isNaN(num) ? "" : String.fromCharCode(num);
        })
        .join("");
    }
    case "binary-to-decimal": {
      const tokens = splitTokens(input).map((t) => t.replace(/^0b/gi, ""));
      const converted = tokens.map((bin) => {
        const num = parseInt(bin, 2);
        return Number.isNaN(num) ? "?" : num.toString(10);
      });
      return joinTokens(converted, delimiter);
    }
    case "binary-to-hex": {
      const tokens = splitTokens(input).map((t) => t.replace(/^0b/gi, ""));
      const converted = tokens.map((bin) => {
        const num = parseInt(bin, 2);
        return Number.isNaN(num) ? "?" : num.toString(16).toUpperCase();
      });
      return joinTokens(converted, delimiter);
    }
    case "binary-to-octal": {
      const tokens = splitTokens(input).map((t) => t.replace(/^0b/gi, ""));
      const converted = tokens.map((bin) => {
        const num = parseInt(bin, 2);
        return Number.isNaN(num) ? "?" : num.toString(8);
      });
      return joinTokens(converted, delimiter);
    }
    case "ascii-to-text":
    case "decimal-to-text": {
      return splitTokens(input)
        .map((dec) => {
          const num = parseInt(dec, 10);
          return Number.isNaN(num) ? "" : String.fromCharCode(num);
        })
        .join("");
    }
    case "text-to-ascii":
    case "text-to-decimal": {
      const converted = Array.from(input).map((char) =>
        String(char.charCodeAt(0))
      );
      return joinTokens(converted, delimiter);
    }
    case "decimal-to-hex": {
      const tokens = splitTokens(input);
      const converted = tokens.map((dec) => {
        const num = parseInt(dec, 10);
        return Number.isNaN(num) ? "?" : num.toString(16).toUpperCase();
      });
      return joinTokens(converted, delimiter);
    }
    case "decimal-to-binary": {
      const tokens = splitTokens(input);
      const converted = tokens.map((dec) => {
        const num = parseInt(dec, 10);
        return Number.isNaN(num) ? "?" : num.toString(2);
      });
      return joinTokens(converted, delimiter);
    }
    case "decimal-to-octal": {
      const tokens = splitTokens(input);
      const converted = tokens.map((dec) => {
        const num = parseInt(dec, 10);
        return Number.isNaN(num) ? "?" : num.toString(8);
      });
      return joinTokens(converted, delimiter);
    }
    case "ascii-to-binary":
    case "text-to-binary": {
      const converted = Array.from(input).map((char) => {
        const binary = char.charCodeAt(0).toString(2);
        return binary.padStart(8, "0");
      });
      return joinTokens(converted, delimiter);
    }
    case "text-to-hex": {
      const converted = Array.from(input).map((char) =>
        char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
      );
      return joinTokens(converted, delimiter);
    }
    case "text-to-octal": {
      const converted = Array.from(input).map((char) =>
        char.charCodeAt(0).toString(8).padStart(3, "0")
      );
      return joinTokens(converted, delimiter);
    }
    case "hex-to-text": {
      return hexByteTokens(input)
        .map((h) => {
          const num = parseInt(h, 16);
          return Number.isNaN(num) ? "" : String.fromCharCode(num & 0xff);
        })
        .join("");
    }
    case "hex-to-binary": {
      const tokens = hexByteTokens(input);
      const converted = tokens.map((h) => {
        const num = parseInt(h, 16);
        return Number.isNaN(num) ? "?" : num.toString(2).padStart(8, "0");
      });
      return joinTokens(converted, delimiter);
    }
    case "hex-to-decimal": {
      const tokens = hexByteTokens(input);
      const converted = tokens.map((h) => {
        const num = parseInt(h, 16);
        return Number.isNaN(num) ? "?" : String(num);
      });
      return joinTokens(converted, delimiter);
    }
    case "hex-to-octal": {
      const tokens = hexByteTokens(input);
      const converted = tokens.map((h) => {
        const num = parseInt(h, 16);
        return Number.isNaN(num) ? "?" : num.toString(8);
      });
      return joinTokens(converted, delimiter);
    }
    case "octal-to-text": {
      return splitTokens(input)
        .map((o) => {
          const num = parseInt(o, 8);
          return Number.isNaN(num) ? "" : String.fromCharCode(num & 0xff);
        })
        .join("");
    }
    case "octal-to-binary": {
      const tokens = splitTokens(input);
      const converted = tokens.map((o) => {
        const num = parseInt(o, 8);
        return Number.isNaN(num) ? "?" : num.toString(2);
      });
      return joinTokens(converted, delimiter);
    }
    case "octal-to-decimal": {
      const tokens = splitTokens(input);
      const converted = tokens.map((o) => {
        const num = parseInt(o, 8);
        return Number.isNaN(num) ? "?" : String(num);
      });
      return joinTokens(converted, delimiter);
    }
    case "octal-to-hex": {
      const tokens = splitTokens(input);
      const converted = tokens.map((o) => {
        const num = parseInt(o, 8);
        return Number.isNaN(num) ? "?" : num.toString(16).toUpperCase();
      });
      return joinTokens(converted, delimiter);
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export default function BaseConverter({
  title = "Data Representation Converter",
  inputPlaceholder,
  outputPlaceholder,
  converterKind,
  autoConvert = true,
}: BaseConverterProps) {
  const [activeKind, setActiveKind] = useState<BaseConverterKind>(converterKind);
  const [delimiter, setDelimiter] = useState<DelimiterType>("space");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setActiveKind(converterKind);
  }, [converterKind]);

  const meta = KIND_METADATA[activeKind] || KIND_METADATA["ascii-to-binary"];
  const reciprocal = RECIPROCAL_MAP[activeKind];

  const [input, setInput, storageMeta] = useToolStorage<string>(
    `converter-${activeKind}`,
    "input",
    ""
  );
  const [output, setOutput] = useState("");

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const res = convertByKind(activeKind, input, delimiter);
      setOutput(res);
    } catch {
      toast.error("Conversion failed. Please verify input data formatting.");
    }
  }, [input, activeKind, delimiter]);

  useEffect(() => {
    if (autoConvert) {
      handleConvert();
    }
  }, [input, activeKind, delimiter, autoConvert, handleConvert]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        toast.success("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard access was denied.");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    storageMeta.clearStorage();
    toast.success("Input cleared");
  };

  const handleLoadSample = () => {
    setInput(meta.sample);
    toast.success("Loaded sample data");
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeKind}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Output file downloaded");
  };

  const handleSwapDirection = () => {
    if (!reciprocal) return;
    const nextKind = reciprocal.kind;
    const swappedInput = output || meta.sample;
    setActiveKind(nextKind);
    setInput(swappedInput);
    toast.success(`Switched direction to ${reciprocal.label}`);
  };

  // Live inspection breakdown for text-based views
  const inspectionItems = useMemo(() => {
    const textToInspect = meta.isTextInput ? input : meta.isTextOutput ? output : "";
    if (!textToInspect) return [];
    return Array.from(textToInspect.slice(0, 24)).map((char, idx) => {
      const code = char.charCodeAt(0);
      return {
        id: idx,
        char: char === " " ? "␣" : char === "\n" ? "↵" : char === "\t" ? "⇥" : char,
        dec: code,
        hex: code.toString(16).toUpperCase().padStart(2, "0"),
        bin: code.toString(2).padStart(8, "0"),
        oct: code.toString(8).padStart(3, "0"),
      };
    });
  }, [input, output, meta.isTextInput, meta.isTextOutput]);

  const inputByteLength = useMemo(() => {
    return new Blob([input]).size;
  }, [input]);

  const outputTokenCount = useMemo(() => {
    if (!output.trim()) return 0;
    return output.trim().split(/[\s,]+/).length;
  }, [output]);

  return (
    <ToolShell className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>{title}</span>
            <Badge variant="outline" className="text-xs font-mono uppercase">
              Client-Side
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Local browser execution with zero server transmission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={storageMeta.isSaved}
            hasStoredValue={storageMeta.hasStoredValue}
            onClear={handleClear}
          />
          {reciprocal && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapDirection}
              className="h-8 gap-1.5 text-xs rounded-lg"
              title={`Switch conversion to ${reciprocal.label}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
              <span>Swap</span>
            </Button>
          )}
        </div>
      </div>

      <ToolGrid className="grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-6 space-y-4">
          <ToolPanel className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <ToolSectionTitle
                  title={meta.inputTitle}
                  subtitle={meta.inputDesc}
                />
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadSample}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Load sample test input"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    Sample
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePaste}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 mr-1" />
                    Paste
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={!input}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    title="Clear input text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder={inputPlaceholder || `Enter ${meta.inputTitle.toLowerCase()} here...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[260px] font-mono text-sm resize-none bg-background/50 focus:bg-background transition-colors leading-relaxed"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>{input.length} characters</span>
                  <span>{inputByteLength} bytes</span>
                </div>
              </div>
            </div>

            {/* Delimiter Selector */}
            <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Output Delimiter:
              </span>
              <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-lg border border-border/50">
                {(["space", "comma", "newline", "none"] as DelimiterType[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDelimiter(d)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all capitalize ${
                      delimiter === d
                        ? "bg-background text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </ToolPanel>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-6 space-y-4">
          <ToolPanel className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <ToolSectionTitle
                  title={meta.outputTitle}
                  subtitle={meta.outputDesc}
                />
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!output}
                    className="h-7 px-2.5 text-xs gap-1"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!output}
                    className="h-7 px-2.5 text-xs gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder={outputPlaceholder || "Converted output will appear here automatically..."}
                  value={output}
                  readOnly
                  className="min-h-[260px] font-mono text-sm resize-none bg-muted/20 text-foreground leading-relaxed"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>{output.length} characters</span>
                  <span>{outputTokenCount} items</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-primary" />
                UTF-8 encoded standard ASCII
              </span>
              <span>100% Client-side sandbox</span>
            </div>
          </ToolPanel>
        </div>
      </ToolGrid>

      {/* Live Inspection Breakdown Table */}
      {inspectionItems.length > 0 && (
        <ToolPanel className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <ToolSectionTitle
              title="Character Encoding Breakdown"
              subtitle="Inspect decimal, hexadecimal, binary, and octal byte codepoints"
            />
            <Badge variant="secondary" className="text-xs font-mono">
              First {inspectionItems.length} chars
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-muted/70 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="px-3 py-2">Glyph</th>
                  <th className="px-3 py-2">ASCII Dec</th>
                  <th className="px-3 py-2">Hex (Base-16)</th>
                  <th className="px-3 py-2">Binary (8-Bit)</th>
                  <th className="px-3 py-2">Octal (Base-8)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 bg-card/40">
                {inspectionItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-1.5 font-bold text-primary font-sans text-sm">
                      {item.char}
                    </td>
                    <td className="px-3 py-1.5 text-foreground">{item.dec}</td>
                    <td className="px-3 py-1.5 text-emerald-600 dark:text-emerald-400">
                      0x{item.hex}
                    </td>
                    <td className="px-3 py-1.5 text-amber-600 dark:text-amber-400">
                      {item.bin}
                    </td>
                    <td className="px-3 py-1.5 text-cyan-600 dark:text-cyan-400">
                      {item.oct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolPanel>
      )}
    </ToolShell>
  );
}
