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

export default function HtmlToXmlEntitiesTool() {
    const [inputText, setInputText] = useState<string>(`<div class="header">
  <h1>SopKit XML Converter</h1>
  <p>Escape & display special tags safely.</p>
</div>`);

    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<"escape" | "unescape">("escape");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const processCodec = useCallback(() => {
        const text = inputText.trim();
        if (!text) {
            setOutputText("");
            return;
        }

        if (mode === "escape") {
            const escaped = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");
            setOutputText(escaped);
        } else {
            const unescaped = text
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&amp;/g, "&");
            setOutputText(unescaped);
        }
    }, [inputText, mode]);

    useEffect(() => {
        processCodec();
    }, [inputText, mode, processCodec]);

    const copyToClipboard = async () => {
        if (!outputText) return;
        try {
            await navigator.clipboard.writeText(outputText);
            setCopiedFormat("entities");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Result copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setInputText("");
        setOutputText("");
    };

    const downloadCode = () => {
        if (!outputText) return;
        const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = mode === "escape" ? `escaped_xml.txt` : `unescaped_html.txt`;
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
                <span>🔒 100% Client-Side Sandbox: HTML to XML entity conversions are processed locally in your browser memory. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">XML Entity Escaper & Unescaper</h2>
                        <p className="text-xs text-muted-foreground">Escape HTML tags to XML safe codes, or unescape XML entity tags back to plain markup locally</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Options
                        </h4>

                        <div className="space-y-1.5">
                            <Label htmlFor="mode-select" className="text-[10px] font-bold text-muted-foreground uppercase">Action</Label>
                            <select
                                id="mode-select"
                                value={mode}
                                onChange={(e) => setMode(e.target.value as "escape" | "unescape")}
                                className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                            >
                                <option value="escape">Escape XML/HTML</option>
                                <option value="unescape">Unescape Entities</option>
                            </select>
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="input-text" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source Data
                        </Label>
                        <Textarea 
                            id="input-text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                            placeholder={mode === "escape" ? "Type raw HTML/XML to escape (e.g. <div>)..." : "Paste escaped XML tags (e.g. &lt;div&gt;)..."}
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Entity Output
                            </Label>
                            {outputText && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "entities" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
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
                                {outputText ? (
                                    <pre className="whitespace-pre-wrap break-all">{outputText}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Converted plain text or entity strings will appear here automatically.
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
