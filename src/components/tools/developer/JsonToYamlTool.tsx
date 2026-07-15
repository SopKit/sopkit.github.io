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

export default function JsonToYamlTool() {
    const [jsonInput, setJsonInput] = useState<string>(JSON.stringify({
        title: "SopKit JSON Converter",
        version: "1.0.0",
        enabled: true,
        tags: ["developer", "tools", "seo"],
        author: {
            name: "Antigravity",
            github: "SopKit"
        }
    }, null, 2));

    const [yamlOutput, setYamlOutput] = useState("");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const convertJson = useCallback(async () => {
        const text = jsonInput.trim();
        if (!text) {
            setYamlOutput("");
            setError("");
            return;
        }

        setIsProcessing(true);
        setError("");
        try {
            const parsed = JSON.parse(text);
            const jsyaml = await import("js-yaml");
            const yamlDump = jsyaml.dump(parsed, { indent: 2, lineWidth: -1 });
            setYamlOutput(yamlDump);
        } catch (err: any) {
            setError(err.message || "Failed to convert JSON. Verify layout structures.");
            setYamlOutput("");
        } finally {
            setIsProcessing(false);
        }
    }, [jsonInput]);

    useEffect(() => {
        convertJson();
    }, [jsonInput, convertJson]);

    const copyToClipboard = async () => {
        if (!yamlOutput) return;
        try {
            await navigator.clipboard.writeText(yamlOutput);
            setCopiedFormat("yaml");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("YAML code copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setJsonInput("");
        setYamlOutput("");
        setError("");
    };

    const downloadCode = () => {
        if (!yamlOutput) return;
        const blob = new Blob([yamlOutput], { type: "text/yaml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `converted.yaml`;
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
                <span>🔒 100% Client-Side Sandbox: Your conversion happens completely in-browser. No payloads are sent to external servers.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON to YAML Converter</h2>
                        <p className="text-xs text-muted-foreground">Translate structured JSON object trees into clean YAML document files locally</p>
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
                        <p className="text-xs font-bold text-destructive">Invalid JSON Input</p>
                        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* JSON Input Panel */}
                <div className="space-y-3.5">
                    <Label htmlFor="json-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                        <Settings className="w-3.5 h-3.5" /> JSON Input
                    </Label>
                    <Textarea 
                        id="json-input"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Paste your raw JSON code here..."
                    />
                </div>

                {/* YAML Output Panel */}
                <div className="space-y-3.5">
                    <div className="flex justify-between items-center px-1">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> YAML Output
                        </Label>
                        {yamlOutput && (
                            <div className="flex gap-1.5">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={copyToClipboard}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "yaml" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
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
                            {isProcessing ? (
                                <div className="h-full flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    <span className="text-[10px] text-muted-foreground animate-pulse">Converting...</span>
                                </div>
                            ) : yamlOutput ? (
                                <pre className="whitespace-pre">{yamlOutput}</pre>
                            ) : (
                                <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                    YAML output will be rendered here.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
