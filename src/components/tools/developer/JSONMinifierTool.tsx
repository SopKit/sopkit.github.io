"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileJson,
    Loader2,
    ShieldCheck,
    Check,
    Copy,
    Trash2,
    Settings,
    Grid,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function JSONMinifierTool() {
    const [jsonInput, setJsonInput] = useState<string>("");
    const [minifiedJson, setMinifiedJson] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [stats, setStats] = useState<{ original: number; minified: number; ratio: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMinify = () => {
        if (!jsonInput.trim()) {
            toast.error("Please enter JSON data first.");
            return;
        }

        setIsProcessing(true);
        try {
            const parsed = JSON.parse(jsonInput);
            const minified = JSON.stringify(parsed);
            
            setMinifiedJson(minified);
            
            const originalSize = new Blob([jsonInput]).size;
            const minifiedSize = new Blob([minified]).size;
            const ratio = originalSize > 0 
                ? Math.round((1 - minifiedSize / originalSize) * 100)
                : 0;

            setStats({
                original: originalSize,
                minified: minifiedSize,
                ratio
            });

            toast.success("JSON minified successfully!");
        } catch (error) {
            toast.error("Invalid JSON. Please verify formatting syntax.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setJsonInput(content);
                setMinifiedJson("");
                setStats(null);
                toast.success("JSON file loaded successfully.");
            };
            reader.readAsText(file);
        }
        event.target.value = "";
    };

    const copyToClipboard = async (text: string, formatId: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(formatId);
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied minified JSON!`);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadJSON = () => {
        if (!minifiedJson) return;
        const blob = new Blob([minifiedJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "minified.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const clearInput = () => {
        setJsonInput("");
        setMinifiedJson("");
        setStats(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Minification runs locally in memory. No file contents are transmitted to any remote servers.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <FileJson className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON Minifier</h2>
                        <p className="text-xs text-muted-foreground">Remove whitespace, newlines, and comments to compact JSON payloads locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Load File
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={clearInput}
                        className="border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                    <Button 
                        disabled={isProcessing || !jsonInput.trim()}
                        onClick={handleMinify}
                        className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Minifying...</>
                        ) : (
                            <><Settings className="mr-2 h-4 w-4" /> Minify JSON</>
                        )}
                    </Button>
                    <input 
                        type="file" 
                        accept="application/json" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Original Size</span>
                        <p className="text-lg md:text-2xl font-black text-foreground mt-1">{formatFileSize(stats.original)}</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Minified Size</span>
                        <p className="text-lg md:text-2xl font-black text-primary mt-1">{formatFileSize(stats.minified)}</p>
                    </Card>
                    <Card className="p-5 border border-border/30 bg-card/10 text-center rounded-2xl">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Size Savings</span>
                        <p className="text-lg md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">-{stats.ratio}%</p>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-4">
                    <Label htmlFor="json-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                        <Settings className="w-3.5 h-3.5" /> JSON Input
                    </Label>
                    <Textarea 
                        id="json-input"
                        value={jsonInput}
                        onChange={(e) => {
                            setJsonInput(e.target.value);
                            setMinifiedJson("");
                            setStats(null);
                        }}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Paste your raw JSON code here..."
                    />
                </div>

                {/* Minified Output */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <FileJson className="w-3.5 h-3.5" /> Compact Output
                        </Label>
                        {minifiedJson && (
                            <div className="flex gap-1.5">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(minifiedJson, "minified")}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "minified" ? (
                                        <><Check className="w-3 h-3 text-emerald-500" /> Copied</>
                                    ) : (
                                        <><Copy className="w-3 h-3 text-primary" /> Copy</>
                                    )}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={downloadJSON}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    <Download className="w-3 h-3 text-primary" /> Download
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[380px] flex flex-col bg-white">
                        <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                            {minifiedJson ? (
                                <pre className="whitespace-pre-wrap break-all">{minifiedJson}</pre>
                            ) : (
                                <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                    Minified JSON output will be rendered here.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
