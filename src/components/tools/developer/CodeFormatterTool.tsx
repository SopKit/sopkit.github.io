"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Upload, 
    Download, 
    Code as CodeIcon,
    Loader2,
    ShieldCheck,
    Check,
    Copy,
    Trash2,
    Settings,
    Grid,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    const [language, setLanguage] = useState("json");
    const [inputCode, setInputCode] = useState(SAMPLES.json);
    const [outputCode, setOutputCode] = useState("");
    const [indentSize, setIndentSize] = useState<string>("2");
    const [sqlDialect, setSqlDialect] = useState("sql");
    const [sqlKeywordCase, setSqlKeywordCase] = useState("upper");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

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
                
                // Format XML structures recursively
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
                    keywordCase: sqlKeywordCase === "preserve" ? undefined : sqlKeywordCase as any,
                });
            } else {
                // HTML, CSS, JavaScript using js-beautify
                const jsBeautify = (await import("js-beautify")) as any;
                const js_beautify = jsBeautify.js || jsBeautify.default?.js || jsBeautify.js_beautify;
                const css_beautify = jsBeautify.css || jsBeautify.default?.css || jsBeautify.css_beautify;
                const html_beautify = jsBeautify.html || jsBeautify.default?.html || jsBeautify.html_beautify;

                const options = {
                    indent_size: indentNum,
                    wrap_line_length: 100,
                };

                if (language === "html") {
                    formatted = html_beautify(inputCode, options);
                } else if (language === "css") {
                    formatted = css_beautify(inputCode, options);
                } else if (language === "javascript") {
                    formatted = js_beautify(inputCode, options);
                }
            }

            setOutputCode(formatted);
        } catch (err: any) {
            setError(err.message || "Failed to format code. Please verify syntax.");
            setOutputCode("");
        } finally {
            setIsProcessing(false);
        }
    }, [inputCode, language, indentSize, sqlDialect, sqlKeywordCase]);

    useEffect(() => {
        formatCode();
    }, [inputCode, language, indentSize, sqlDialect, sqlKeywordCase, formatCode]);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        setInputCode(SAMPLES[lang] || "");
        setOutputCode("");
        setError("");
    };

    const copyToClipboard = async () => {
        if (!outputCode) return;
        try {
            await navigator.clipboard.writeText(outputCode);
            setCopiedFormat("beautified");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Beautified code copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setInputCode("");
        setOutputCode("");
        setError("");
    };

    const downloadCode = () => {
        if (!outputCode) return;
        const extensions: Record<string, string> = {
            json: "json",
            xml: "xml",
            sql: "sql",
            html: "html",
            css: "css",
            javascript: "js",
        };
        const ext = extensions[language] || "txt";
        const blob = new Blob([outputCode], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `formatted_code.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Code formatting is processed locally in browser RAM. No script data leaves your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Multi-Language Code Formatter</h2>
                        <p className="text-xs text-muted-foreground">Prettify and format JSON, XML, HTML, CSS, JS, and SQL queries locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={clearAll}
                        className="border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                </div>
            </div>

            {error && (
                <Card className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl text-xs font-mono text-destructive">
                    {error}
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs font-semibold">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5 text-primary" /> Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="language-select" className="text-[10px] font-bold text-muted-foreground uppercase">Language</Label>
                                <select
                                    id="language-select"
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    {LANGUAGES.map(l => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="indent-select" className="text-[10px] font-bold text-muted-foreground uppercase">Indentation</Label>
                                <select
                                    id="indent-select"
                                    value={indentSize}
                                    onChange={(e) => setIndentSize(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="2">2 Spaces</option>
                                    <option value="4">4 Spaces</option>
                                    <option value="8">8 Spaces</option>
                                </select>
                            </div>

                            {language === "sql" && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="dialect-select" className="text-[10px] font-bold text-muted-foreground uppercase">SQL Dialect</Label>
                                        <select
                                            id="dialect-select"
                                            value={sqlDialect}
                                            onChange={(e) => setSqlDialect(e.target.value)}
                                            className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                        >
                                            {DIALECTS.map(d => (
                                                <option key={d.value} value={d.value}>{d.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="case-select" className="text-[10px] font-bold text-muted-foreground uppercase">Keywords Case</Label>
                                        <select
                                            id="case-select"
                                            value={sqlKeywordCase}
                                            onChange={(e) => setSqlKeywordCase(e.target.value)}
                                            className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                        >
                                            <option value="upper">UPPERCASE</option>
                                            <option value="lower">lowercase</option>
                                            <option value="preserve">preserve original</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="input-code" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source Code
                        </Label>
                        <Textarea 
                            id="input-code"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[420px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                            placeholder={`Paste your raw ${language.toUpperCase()} code here...`}
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Beautified Output
                            </Label>
                            {outputCode && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "beautified" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={downloadCode}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        <Download className="w-3 h-3 text-primary" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[420px] flex flex-col bg-white">
                            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                                {isProcessing ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        <span className="text-[10px] text-muted-foreground animate-pulse">Prettifying...</span>
                                    </div>
                                ) : outputCode ? (
                                    <pre className="whitespace-pre">{outputCode}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Beautified code will appear here automatically.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
