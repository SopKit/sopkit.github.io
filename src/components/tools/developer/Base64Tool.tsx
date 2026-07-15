"use client";

import { useState, useCallback, useRef } from "react";
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

interface FileInfo {
    name: string;
    size: number;
    type: string;
}

export default function Base64Tool({ initialMode = "encode" }: { initialMode?: "encode" | "decode" }) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode" | "file-encode">(initialMode as any);
    const [error, setError] = useState("");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processText = useCallback((textStr: string, operation: "encode" | "decode") => {
        try {
            setError("");
            if (!textStr) {
                setOutput("");
                return;
            }

            if (operation === "encode") {
                const encoded = btoa(unescape(encodeURIComponent(textStr)));
                setOutput(encoded);
            } else {
                const decoded = decodeURIComponent(escape(atob(textStr)));
                setOutput(decoded);
            }
        } catch (err: any) {
            setError(`Invalid Base64 string for decoding: ${err.message || "parsing error"}`);
            setOutput("");
        }
    }, []);

    const handleInputChange = (value: string) => {
        setInput(value);
        if (mode !== "file-encode") {
            processText(value, mode as any);
        }
    };

    const handleModeChange = (newMode: "encode" | "decode" | "file-encode") => {
        setMode(newMode);
        setInput("");
        setOutput("");
        setError("");
        setFileInfo(null);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type
        });

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            // Extract pure base64 data split-off from standard prefix
            const base64Data = result.includes(",") ? result.split(",")[1] : result;
            setInput(`Loaded Local File: ${file.name}`);
            setOutput(base64Data);
            toast.success(`Successfully encoded "${file.name}" to Base64.`);
        };
        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const copyToClipboard = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopiedFormat("base64");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Result copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const downloadResult = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = mode === "decode" ? "decoded_text.txt" : "encoded_base64.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setFileInfo(null);
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
                <span>🔒 100% Client-Side Sandbox: Base64 encoding/decoding is performed locally inside your browser RAM. No payloads are sent to servers.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Base64 Encoder & Decoder</h2>
                        <p className="text-xs text-muted-foreground">Encode text and binary file packages to base64, or decode strings back to raw UTF-8 strings locally</p>
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
                        <p className="text-xs font-bold text-destructive">Format Parsing Exception</p>
                        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Operations
                        </h4>

                        <div className="flex flex-col gap-2">
                            <Button 
                                type="button" 
                                variant={mode === "encode" ? "secondary" : "ghost"}
                                onClick={() => handleModeChange("encode")}
                                className="justify-start text-xs font-bold h-9"
                            >
                                Text to Base64 (Encode)
                            </Button>
                            <Button 
                                type="button" 
                                variant={mode === "decode" ? "secondary" : "ghost"}
                                onClick={() => handleModeChange("decode")}
                                className="justify-start text-xs font-bold h-9"
                            >
                                Base64 to Text (Decode)
                            </Button>
                            <Button 
                                type="button" 
                                variant={mode === "file-encode" ? "secondary" : "ghost"}
                                onClick={() => handleModeChange("file-encode")}
                                className="justify-start text-xs font-bold h-9"
                            >
                                Encode File to Base64
                            </Button>
                        </div>
                    </Card>

                    {fileInfo && (
                        <Card className="p-4 border border-border/30 bg-card/10 rounded-2xl space-y-2 text-xs">
                            <div className="text-[10px] text-muted-foreground font-bold uppercase">File Encoded Details</div>
                            <p className="font-bold truncate text-foreground">{fileInfo.name}</p>
                            <p className="text-[10px] text-muted-foreground">{formatFileSize(fileInfo.size)} ({fileInfo.type})</p>
                        </Card>
                    )}
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="source-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source Data
                        </Label>
                        {mode === "file-encode" ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center h-[380px]"
                            >
                                <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                    <Upload className="h-8 w-8 text-primary/40 group-hover:text-primary/60" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold">Select File to Encode</h3>
                                <p className="mt-1 text-[10px] text-muted-foreground max-w-[160px] leading-relaxed">
                                    Upload any image, document, or binary file to generate its pure base64 representation.
                                </p>
                            </div>
                        ) : (
                            <Textarea 
                                id="source-input"
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                                placeholder={mode === "encode" ? "Type or paste standard text to encode..." : "Paste Base64 encoded string to decode..."}
                            />
                        )}
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Conversion Output
                            </Label>
                            {output && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "base64" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={downloadResult}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        <Download className="w-3 h-3 text-primary" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[380px] flex flex-col bg-white">
                            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                                {output ? (
                                    <pre className="whitespace-pre-wrap break-all">{output}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Base64 output strings or decoded plain text will appear here automatically.
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
