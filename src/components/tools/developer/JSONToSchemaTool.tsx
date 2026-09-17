"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  FileJson,
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
import { Textarea } from "@/components/ui/textarea";
import { useToolStorage, useCopyFeedback } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const DEFAULT_JSON = JSON.stringify(
  {
    id: 1,
    title: "Product Item",
    price: 99.9,
    inStock: true,
    tags: ["electronics", "audio"],
    dimensions: {
      length: 12.5,
      width: 7.0,
    },
  },
  null,
  2
);

export default function JSONToSchemaTool() {
  const [jsonInput, setJsonInput, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("json-to-schema", "input", DEFAULT_JSON);

  const [draftVersion, setDraftVersion] = useToolStorage<string>(
    "json-to-schema",
    "draft",
    "draft-07"
  );

  const [schemaOutput, setSchemaOutput] = useState("");
  const [error, setError] = useState("");
  const { copied, copy } = useCopyFeedback();

  const generateSchema = useCallback(() => {
    const text = jsonInput.trim();
    if (!text) {
      setSchemaOutput("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setError("");

      const schemaBase: Record<string, any> = {
        $schema:
          draftVersion === "draft-07"
            ? "http://json-schema.org/draft-07/schema#"
            : "http://json-schema.org/draft-04/schema#",
        type: "object",
      };

      const buildPropertiesSchema = (val: any): any => {
        const valType = Array.isArray(val)
          ? "array"
          : val === null
          ? "null"
          : typeof val;

        if (valType === "object") {
          const props: Record<string, any> = {};
          const req: string[] = [];
          for (const [k, v] of Object.entries(val)) {
            props[k] = buildPropertiesSchema(v);
            req.push(k);
          }
          return {
            type: "object",
            properties: props,
            required: req,
          };
        } else if (valType === "array") {
          if (val.length === 0) {
            return { type: "array", items: {} };
          }
          return {
            type: "array",
            items: buildPropertiesSchema(val[0]),
          };
        } else if (valType === "number") {
          return { type: Number.isInteger(val) ? "integer" : "number" };
        } else {
          return { type: valType };
        }
      };

      if (Array.isArray(parsed)) {
        schemaBase.type = "array";
        schemaBase.items =
          parsed.length > 0 ? buildPropertiesSchema(parsed[0]) : {};
      } else if (typeof parsed === "object" && parsed !== null) {
        const full = buildPropertiesSchema(parsed);
        schemaBase.properties = full.properties;
        schemaBase.required = full.required;
      }

      setSchemaOutput(JSON.stringify(schemaBase, null, 2));
    } catch (err: any) {
      setError(`Invalid JSON structure: ${err.message || "Parse failed"}`);
      setSchemaOutput("");
    }
  }, [jsonInput, draftVersion]);

  useEffect(() => {
    generateSchema();
  }, [generateSchema]);

  const copyToClipboard = async () => {
    if (!schemaOutput) return;
    const ok = await copy(schemaOutput);
    if (ok) toast.success("Copied JSON Schema to clipboard");
  };

  const downloadSchema = () => {
    if (!schemaOutput) return;
    const blob = new Blob([schemaOutput], {
      type: "application/schema+json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schema.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded schema.json");
  };

  const clearAll = () => {
    clearStorage();
    setJsonInput("");
    setSchemaOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-background/80 border border-border/50 rounded-lg">
            <Button
              variant={draftVersion === "draft-07" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDraftVersion("draft-07")}
              className="h-7 text-xs font-semibold rounded-md"
            >
              Draft-07
            </Button>
            <Button
              variant={draftVersion === "draft-04" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDraftVersion("draft-04")}
              className="h-7 text-xs font-semibold rounded-md"
            >
              Draft-04
            </Button>
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
              htmlFor="json-schema-source"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source JSON
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {jsonInput ? `${jsonInput.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="json-schema-source"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[380px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder="Paste JSON to generate schema..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Generated JSON Schema
            </Label>
            {schemaOutput && (
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
                  onClick={downloadSchema}
                  className="h-6 text-[10px] font-mono gap-1 px-2 rounded-md"
                >
                  <Download className="w-3 h-3" /> Save Schema
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[380px] overflow-auto select-text">
            {schemaOutput ? (
              <pre className="text-foreground/90 whitespace-pre leading-relaxed text-emerald-300 dark:text-emerald-400">
                {schemaOutput}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                JSON Schema will appear here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
