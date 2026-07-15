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

export default function HtmlMinifierTool() {
    const [htmlInput, setHtmlInput] = useState<string>(`<!DOCTYPE html>
<html>
  <head>
    <!-- This is a comment to be stripped -->
    <title>SopKit HTML Minifier</title>
    <style>
      body {
        background-color: #ffffff;
        color: #333333;
      }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>
      Minifying your HTML code makes it load much faster.
    </p>
  </body>
</html>`);

    const [htmlOutput, setHtmlOutput] = useState("");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [stats, setStats] = useState<{ original: number; minified: number; ratio: number } | null>(null);

    const runMinify = useCallback(() => {
        const text = htmlInput.trim();
        if (!text) {
            setHtmlOutput("");
            setStats(null);
            return;
        }

        try {
            let minified = text;

            // 1. Remove comments
            minified = minified.replace(/<!--[\s\S]*?-->/g, "");

            // 2. Remove script/style whitespaces carefully
            minified = minified.replace(/\s+/g, " ");

            // 3. Remove space between tags
            minified = minified.replace(/>\s+</g, "><");

            // 4. Trim layout
            minified = minified.trim();

            setHtmlOutput(minified);

            const originalSize = new Blob([text]).size;
            const minifiedSize = new Blob([minified]).size;
            const ratio = originalSize > 0 
                ? Math.round((1 - minifiedSize / originalSize) * 100)
                : 0;

            setStats({
                original: originalSize,
                minified: minifiedSize,
                ratio
            });
        } catch (err: any) {
            console.error(err);
            setHtmlOutput("");
            setStats(null);
        }
    }, [htmlInput]);

    useEffect(() => {
        runMinify();
    }, [htmlInput, runMinify]);

    const copyToClipboard = async () => {
        if (!htmlOutput) return;
        try {
            await navigator.clipboard.writeText(htmlOutput);
            setCopiedFormat("minified");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Minified HTML copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setHtmlInput("");
        setHtmlOutput("");
        setStats(null);
    };

    const downloadCode = () => {
        if (!htmlOutput) return;
        const blob = new Blob([htmlOutput], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `minified.html`;
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
                <span>🔒 100% Client-Side Sandbox: HTML minification runs locally in your browser memory. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">HTML Minifier</h2>
                        <p className="text-xs text-muted-foreground">Compress HTML documents, strip comments, and decrease file sizes locally</p>
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

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Original Size</span>
                        <p className="text-lg md:text-2xl font-black text-foreground mt-1">{stats.original} Bytes</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Minified Size</span>
                        <p className="text-lg md:text-2xl font-black text-primary mt-1">{stats.minified} Bytes</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Size Savings</span>
                        <p className="text-lg md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">-{stats.ratio}%</p>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* HTML Input Panel */}
                <div className="space-y-3.5">
                    <Label htmlFor="html-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                        <Settings className="w-3.5 h-3.5" /> HTML Input
                    </Label>
                    <Textarea 
                        id="html-input"
                        value={htmlInput}
                        onChange={(e) => setHtmlInput(e.target.value)}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Paste your raw HTML document here..."
                    />
                </div>

                {/* Minified Output Panel */}
                <div className="space-y-3.5">
                    <div className="flex justify-between items-center px-1">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Compact HTML Output
                        </Label>
                        {htmlOutput && (
                            <div className="flex gap-1.5">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={copyToClipboard}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "minified" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
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
                            {htmlOutput ? (
                                <pre className="whitespace-pre-wrap break-all">{htmlOutput}</pre>
                            ) : (
                                <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                    Minified HTML will be rendered here.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
