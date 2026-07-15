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
    Sparkles,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validate, format, minify } from "@sopkit/xml";

export default function XmlFormatterTool() {
    const [xmlInput, setXmlInput] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<store>
<book id="1"><title>The Hobbit</title><author>J.R.R. Tolkien</author><price>14.99</price></book>
<book id="2"><title>Dune</title><author>Frank Herbert</author><price>12.99</price></book>
</store>`);

    const [xmlOutput, setXmlOutput] = useState("");
    const [mode, setMode] = useState<"beautify" | "minify">("beautify");
    const [indentSize, setIndentSize] = useState<number>(2);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{ original: number; minified: number; ratio: number } | null>(null);

    const processXml = useCallback(() => {
        const text = xmlInput.trim();
        if (!text) {
            setXmlOutput("");
            setError("");
            setStats(null);
            return;
        }

        try {
            const validation = validate(text);
            if (!validation.valid) {
                setError(validation.error || "Invalid XML markup schema.");
                setXmlOutput("");
                setStats(null);
                return;
            }
            setError("");

            let processed = "";
            if (mode === "minify") {
                processed = minify(text);
            } else {
                processed = format(text, indentSize);
            }
            setXmlOutput(processed);

            const originalSize = new Blob([text]).size;
            const minifiedSize = new Blob([processed]).size;
            const ratio = originalSize > 0 
                ? Math.round((1 - minifiedSize / originalSize) * 100)
                : 0;

            setStats({
                original: originalSize,
                minified: minifiedSize,
                ratio
            });
        } catch (err: any) {
            setError(err.message || "Failed to parse XML code.");
            setXmlOutput("");
            setStats(null);
        }
    }, [xmlInput, mode, indentSize]);

    useEffect(() => {
        processXml();
    }, [xmlInput, mode, indentSize, processXml]);

    const copyToClipboard = async () => {
        if (!xmlOutput) return;
        try {
            await navigator.clipboard.writeText(xmlOutput);
            setCopiedFormat("formatted");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("XML copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setXmlInput("");
        setXmlOutput("");
        setError("");
        setStats(null);
    };

    const downloadCode = () => {
        if (!xmlOutput) return;
        const blob = new Blob([xmlOutput], { type: "application/xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `formatted.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: XML processing and validations run locally in browser memory. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">XML Formatter & Validator</h2>
                        <p className="text-xs text-muted-foreground">Format, beautify, minify, and validate XML document structures locally</p>
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
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-destructive">Invalid XML Syntax</p>
                        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Original Size</span>
                        <p className="text-lg md:text-2xl font-black text-foreground mt-1">{stats.original} Bytes</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Processed Size</span>
                        <p className="text-lg md:text-2xl font-black text-primary mt-1">{stats.minified} Bytes</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Savings Ratio</span>
                        <p className="text-lg md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {stats.ratio > 0 ? `-${stats.ratio}%` : `${Math.abs(stats.ratio)}% larger`}
                        </p>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Output Options
                        </h4>

                        <div className="space-y-4">
                            <div className="flex gap-2 p-1 bg-muted/20 border border-border/20 rounded-lg">
                                <Button 
                                    type="button" 
                                    variant={mode === "beautify" ? "secondary" : "ghost"}
                                    onClick={() => setMode("beautify")}
                                    className="flex-1 text-[10px] font-bold h-7"
                                >
                                    Beautify
                                </Button>
                                <Button 
                                    type="button" 
                                    variant={mode === "minify" ? "secondary" : "ghost"}
                                    onClick={() => setMode("minify")}
                                    className="flex-1 text-[10px] font-bold h-7"
                                >
                                    Minify
                                </Button>
                            </div>

                            {mode === "beautify" && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="indent-select" className="text-[10px] font-bold text-muted-foreground uppercase">Indentation</Label>
                                    <select
                                        id="indent-select"
                                        value={indentSize}
                                        onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
                                        className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                    >
                                        <option value="2">2 Spaces</option>
                                        <option value="4">4 Spaces</option>
                                        <option value="8">8 Spaces</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="xml-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source XML Code
                        </Label>
                        <Textarea 
                            id="xml-input"
                            value={xmlInput}
                            onChange={(e) => setXmlInput(e.target.value)}
                            className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                            placeholder="Paste your raw XML code here..."
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Processed XML Output
                            </Label>
                            {xmlOutput && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "formatted" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
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
                        <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[380px] flex flex-col bg-white">
                            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                                {xmlOutput ? (
                                    <pre className="whitespace-pre">{xmlOutput}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Processed XML will appear here automatically.
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
