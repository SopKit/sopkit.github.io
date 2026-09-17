"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Code as CodeIcon,
  Loader2,
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

const LANGUAGES = [
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript (JS)" },
];

const DIALECTS = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "tsql", label: "Transact-SQL" },
  { value: "plsql", label: "Oracle PL/SQL" },
];

const SAMPLES: Record<string, string> = {
  json: `{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","coding"],"address":{"street":"123 Main St","zip":10001}}`,
  xml: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><price>44.95</price></book></catalog>`,
  sql: `SELECT users.id, users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 ORDER BY orders.total DESC;`,
  html: `<!DOCTYPE html><html><head><title>Test Page</title></head><body><div id="main"><h1>Hello World</h1><p>This is a <b>formatted</b> markup code.</p></div></body></html>`,
  css: `body{background-color:#f0f2f5;color:#1c1e21;font-family:sans-serif;}#main{max-width:800px;margin:0 auto;padding:20px;border-radius:8px;}`,
  javascript: `function greet(user){const msg="Hello, "+user+"!";console.log(msg);return msg;}greet("SopKit");`,
};

export default function CodeFormatterTool() {
  const [language, setLanguage] = useToolStorage<string>(
    "code-formatter",
    "lang",
    "json"
  );
  const [inputCode, setInputCode, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("code-formatter", "code", SAMPLES.json);
  const [indentSize, setIndentSize] = useToolStorage<string>(
    "code-formatter",
    "indent",
    "2"
  );
  const [sqlDialect, setSqlDialect] = useToolStorage<string>(
    "code-formatter",
    "dialect",
    "sql"
  );
  const [sqlKeywordCase, setSqlKeywordCase] = useToolStorage<string>(
    "code-formatter",
    "case",
    "upper"
  );

  const [outputCode, setOutputCode] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { copied, copy } = useCopyFeedback();

  const formatCode = useCallback(async () => {
    if (!inputCode.trim()) {
      setOutputCode("");
      setError("");
      return;
    }

    setError("");
    setIsProcessing(true);
    try {
      let formatted = "";
      const indentNum = parseInt(indentSize, 10) || 2;

      if (language === "json") {
        const parsed = JSON.parse(inputCode);
        formatted = JSON.stringify(parsed, null, indentNum);
      } else if (language === "xml") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(inputCode, "application/xml");
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error(parserError.textContent || "Invalid XML Structure");
        }

        let cleanXml = inputCode.replace(/>\s*</g, "><").trim();
        let pad = 0;
        const reg = /(>)(<)(\/*)/g;
        cleanXml = cleanXml.replace(reg, "$1\r\n$2$3");
        const lines = cleanXml.split("\r\n");
        let result = "";
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          let indentLevel = 0;
          if (line.match(/.+<\/\w[^>]*>$/)) {
            indentLevel = 0;
          } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
          } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indentLevel = 1;
          } else {
            indentLevel = 0;
          }

          const padding = " ".repeat(pad * indentNum);
          result += padding + line + "\n";
          pad += indentLevel;
        }
        formatted = result.trim();
      } else if (language === "sql") {
        const sqlFormatter = await import("sql-formatter");
        formatted = sqlFormatter.format(inputCode, {
          language: sqlDialect as any,
          tabWidth: indentNum,
          keywordCase:
            sqlKeywordCase === "preserve" ? undefined : (sqlKeywordCase as any),
        });
      } else {
        const jsBeautify = (await import("js-beautify")) as any;
        const options = {
          indent_size: indentNum,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          keep_array_indentation: false,
          break_chained_methods: false,
          indent_scripts: "normal",
          brace_style: "collapse",
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          end_with_newline: false,
          wrap_line_length: 0,
        };

        if (language === "html") {
          formatted = jsBeautify.html(inputCode, options);
        } else if (language === "css") {
          formatted = jsBeautify.css(inputCode, options);
        } else if (language === "javascript") {
          formatted = jsBeautify.js(inputCode, options);
        }
      }

      setOutputCode(formatted);
    } catch (err: any) {
      setError(err.message || "Failed to format code. Verify syntax integrity.");
      setOutputCode("");
    } finally {
      setIsProcessing(false);
    }
  }, [inputCode, language, indentSize, sqlDialect, sqlKeywordCase]);

  useEffect(() => {
    formatCode();
  }, [formatCode]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (SAMPLES[newLang]) {
      setInputCode(SAMPLES[newLang]);
    }
  };

  const copyToClipboard = async () => {
    if (!outputCode) return;
    const ok = await copy(outputCode);
    if (ok) toast.success("Copied formatted code to clipboard");
  };

  const downloadCode = () => {
    if (!outputCode) return;
    const extMap: Record<string, string> = {
      json: "json",
      xml: "xml",
      sql: "sql",
      html: "html",
      css: "css",
      javascript: "js",
    };
    const ext = extMap[language] || "txt";
    const blob = new Blob([outputCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formatted.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded formatted.${ext}`);
  };

  const clearAll = () => {
    clearStorage();
    setInputCode("");
    setOutputCode("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Lang:
            </Label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-7 px-2 rounded-lg border border-border/50 bg-background text-xs font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Indent:
            </Label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value)}
              className="h-7 px-2 rounded-lg border border-border/50 bg-background text-xs"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="8">8 Spaces</option>
            </select>
          </div>

          {language === "sql" && (
            <>
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  Dialect:
                </Label>
                <select
                  value={sqlDialect}
                  onChange={(e) => setSqlDialect(e.target.value)}
                  className="h-7 px-2 rounded-lg border border-border/50 bg-background text-xs"
                >
                  {DIALECTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  Keywords:
                </Label>
                <select
                  value={sqlKeywordCase}
                  onChange={(e) => setSqlKeywordCase(e.target.value)}
                  className="h-7 px-2 rounded-lg border border-border/50 bg-background text-xs"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="preserve">Preserve</option>
                </select>
              </div>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputCode(SAMPLES[language] || "")}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Sample
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={clearAll}
          />
          {inputCode && (
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
        <div className="p-3.5 border border-destructive/30 bg-destructive/10 rounded-xl text-xs font-mono text-destructive">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="code-formatter-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-primary" /> Source{" "}
              {language.toUpperCase()}
            </Label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {inputCode ? `${inputCode.length} chars` : "Empty"}
            </span>
          </div>

          <Textarea
            id="code-formatter-input"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="font-mono text-xs leading-relaxed border-border/50 bg-background/60 h-[400px] resize-none focus-visible:ring-primary/30 rounded-xl p-3.5 transition-all"
            placeholder={`Paste raw ${language.toUpperCase()} code here...`}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Formatted Code
            </Label>
            {outputCode && (
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

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 font-mono text-xs h-[400px] overflow-auto select-text">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Formatting code...</span>
              </div>
            ) : outputCode ? (
              <pre className="text-foreground/90 whitespace-pre leading-relaxed">
                {outputCode}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/60 italic text-xs">
                Formatted code will appear here automatically...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
