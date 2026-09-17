"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Key,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Clock,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Layers,
  Code2,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { decode } from "@sopkit/jwt";
import { toast } from "sonner";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const SAMPLE_TOKENS = {
  hs256:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4AcgsFqA7v3c8t-5D62mP94G-Lq1_6gqG4q5x4C1v4M",
  rs256:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEtZGV2In0.eyJpc3MiOiJhdXRoMC5zb3BraXQuc3BhY2UiLCJzdWIiOiJ1c3Jfc29wa2l0XzAxIiwicm9sZXMiOlsicHJlbWl1bSIsImRldmVsb3BlciJdLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTk5MDAwMDAwMH0.signature_placeholder_rs256",
  expired:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyX2V4cGlyZWQiLCJleHAiOjEzMDAwMDAwMDB9.invalid_or_expired_signature_demo",
};

export default function JWTDecoderTool() {
  const [jwtInput, setJwtInput, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("jwt-decoder", "token", SAMPLE_TOKENS.hs256);

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const { copy } = useCopyFeedback();

  // Split token parts for visual syntax color bar
  const tokenParts = useMemo(() => {
    const raw = (jwtInput || "").trim();
    if (!raw) return { header: "", payload: "", signature: "" };
    const parts = raw.split(".");
    return {
      header: parts[0] || "",
      payload: parts[1] || "",
      signature: parts.slice(2).join(".") || "",
    };
  }, [jwtInput]);

  // Decode result memoized
  const decodeResult = useMemo(() => {
    const raw = (jwtInput || "").trim();
    if (!raw) {
      return {
        isValid: null,
        header: null,
        payload: null,
        signature: "",
        headerStr: "",
        payloadStr: "",
        expiryDate: null,
        isExpired: null,
        expiresInText: null,
      };
    }

    try {
      const decoded = decode(raw);
      const headerStr = JSON.stringify(decoded.header, null, 2);
      const payloadStr = JSON.stringify(decoded.payload, null, 2);

      let expiryDate: string | null = null;
      let isExpired: boolean | null = null;
      let expiresInText: string | null = null;

      if (decoded.payload && typeof decoded.payload.exp === "number") {
        const expMs = decoded.payload.exp * 1000;
        const now = Date.now();
        const date = new Date(expMs);
        expiryDate = date.toLocaleString();
        isExpired = expMs < now;

        const diffSec = Math.round(Math.abs(expMs - now) / 1000);
        if (diffSec < 60) {
          expiresInText = isExpired ? `${diffSec}s ago` : `in ${diffSec}s`;
        } else if (diffSec < 3600) {
          const m = Math.floor(diffSec / 60);
          expiresInText = isExpired ? `${m}m ago` : `in ${m}m`;
        } else if (diffSec < 86400) {
          const h = Math.floor(diffSec / 3600);
          expiresInText = isExpired ? `${h}h ago` : `in ${h}h`;
        } else {
          const d = Math.floor(diffSec / 86400);
          expiresInText = isExpired ? `${d}d ago` : `in ${d}d`;
        }
      }

      return {
        isValid: true,
        header: decoded.header as Record<string, any>,
        payload: decoded.payload as Record<string, any>,
        signature: decoded.signature || "",
        headerStr,
        payloadStr,
        expiryDate,
        isExpired,
        expiresInText,
      };
    } catch {
      return {
        isValid: false,
        header: null,
        payload: null,
        signature: "",
        headerStr: "",
        payloadStr: "",
        expiryDate: null,
        isExpired: null,
        expiresInText: null,
      };
    }
  }, [jwtInput]);

  const handleCopy = async (text: string, formatId: string) => {
    if (!text) return;
    const ok = await copy(text);
    if (ok) {
      setCopiedFormat(formatId);
      setTimeout(() => setCopiedFormat(null), 1500);
      toast.success(`Copied ${formatId} to clipboard`);
    }
  };

  const loadSample = (type: keyof typeof SAMPLE_TOKENS) => {
    setJwtInput(SAMPLE_TOKENS[type]);
    toast.success(`Loaded ${type.toUpperCase()} sample JWT`);
  };

  const handleClear = () => {
    clearStorage();
    setJwtInput("");
    toast.info("Cleared token input");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Presets:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSample("hs256")}
            className="h-7 text-xs font-mono rounded-lg"
          >
            HS256 Standard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSample("rs256")}
            className="h-7 text-xs font-mono rounded-lg"
          >
            RS256 Public Key
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSample("expired")}
            className="h-7 text-xs font-mono rounded-lg"
          >
            Expired Token
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={handleClear}
          />
          {jwtInput && (
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

      {/* Invalid Warning */}
      {decodeResult.isValid === false && (
        <div className="p-3.5 border border-destructive/30 bg-destructive/10 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-destructive">Invalid JWT Format</p>
            <p className="text-muted-foreground font-mono text-[11px]">
              Expected a 3-part dot-separated Base64URL string (Header.Payload.Signature).
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left = Token Input, Right = Decoded Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Input Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="jwt-token-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-primary" /> Encoded Token
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {jwtInput ? `${jwtInput.length} chars` : "Paste or type"}
            </span>
          </div>

          <Textarea
            id="jwt-token-input"
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[340px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Paste raw JWT here (e.g. eyJhbGciOi...)..."
            spellCheck={false}
          />

          {/* Color-Coded Part Breakdown Preview */}
          {tokenParts.header && (
            <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Token Anatomy:
              </span>
              <div className="font-mono text-[11px] break-all leading-relaxed max-h-24 overflow-y-auto pr-1">
                <span className="text-rose-500 font-semibold bg-rose-500/10 px-1 py-0.5 rounded">
                  {tokenParts.header}
                </span>
                <span className="text-muted-foreground">.</span>
                <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-1 py-0.5 rounded">
                  {tokenParts.payload}
                </span>
                {tokenParts.signature && (
                  <>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-1 py-0.5 rounded">
                      {tokenParts.signature}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Expiration Status Card */}
          {decodeResult.expiryDate && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                decodeResult.isExpired
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              {decodeResult.isExpired ? (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              )}
              <div className="text-xs">
                <div className="font-semibold flex items-center gap-2">
                  <span>
                    {decodeResult.isExpired ? "Token Expired" : "Token Active"}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
                    {decodeResult.expiresInText}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {decodeResult.expiryDate}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Decoded Inspection Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Decoded Header Panel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Header (Algorithm & Token Type)
              </Label>
              {decodeResult.headerStr && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(decodeResult.headerStr, "header")}
                  className="h-6 text-[10px] px-2 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 font-mono gap-1"
                >
                  {copiedFormat === "header" ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy JSON
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-card/60 p-3 font-mono text-xs overflow-x-auto min-h-[70px]">
              {decodeResult.headerStr ? (
                <pre className="text-rose-300 dark:text-rose-400 leading-relaxed">
                  {decodeResult.headerStr}
                </pre>
              ) : (
                <span className="text-muted-foreground/60 italic text-xs">
                  Header will appear here...
                </span>
              )}
            </div>
          </div>

          {/* Decoded Payload Panel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Payload (Claims & User Data)
              </Label>
              {decodeResult.payloadStr && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(decodeResult.payloadStr, "payload")}
                  className="h-6 text-[10px] px-2 rounded-md hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-400 font-mono gap-1"
                >
                  {copiedFormat === "payload" ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy JSON
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-card/60 p-3 font-mono text-xs overflow-x-auto min-h-[140px] max-h-[300px]">
              {decodeResult.payloadStr ? (
                <pre className="text-indigo-300 dark:text-indigo-400 leading-relaxed">
                  {decodeResult.payloadStr}
                </pre>
              ) : (
                <span className="text-muted-foreground/60 italic text-xs">
                  Payload claims will appear here...
                </span>
              )}
            </div>
          </div>

          {/* Signature Panel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Signature Verification
              </Label>
              {decodeResult.signature && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopy(decodeResult.signature, "signature")
                  }
                  className="h-6 text-[10px] px-2 rounded-md hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 font-mono gap-1"
                >
                  {copiedFormat === "signature" ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Copy Signature
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-card/60 p-3 font-mono text-xs break-all overflow-x-auto min-h-[50px]">
              {decodeResult.signature ? (
                <pre className="text-emerald-300 dark:text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  {decodeResult.signature}
                </pre>
              ) : (
                <span className="text-muted-foreground/60 italic text-xs">
                  Signature hash string will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
