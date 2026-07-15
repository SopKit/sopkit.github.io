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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JsonToTypeScriptTool() {
    const [jsonInput, setJsonInput] = useState<string>(JSON.stringify({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        isActive: true,
        role: "developer",
        profile: {
            avatar: "https://example.com/avatar.jpg",
            bio: "Code enthusiast",
            skills: ["React", "TypeScript", "Node.js"]
        },
        projects: [
            { id: 101, name: "SopKit Portfolio", status: "completed" },
            { id: 102, name: "Cloud Dashboard", status: "in-progress" }
        ]
    }, null, 2));

    const [tsOutput, setTsOutput] = useState("");
    const [rootName, setRootName] = useState("RootObject");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");

    const convertJsonToTs = useCallback(() => {
        const text = jsonInput.trim();
        if (!text) {
            setTsOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(text);
            setError("");

            const interfaces: string[] = [];
            const seenNames = new Set<string>();

            const capitalize = (s: string) => {
                return s.charAt(0).toUpperCase() + s.slice(1).replace(/[^a-zA-Z0-9]/g, "");
            };

            const getTypeName = (val: any, keyName: string): string => {
                if (val === null) return "any";
                if (Array.isArray(val)) {
                    if (val.length === 0) return "any[]";
                    const typeOfFirst = typeof val[0];
                    if (typeOfFirst === "object" && val[0] !== null) {
                        const subName = capitalize(keyName) + "Item";
                        generateInterface(val[0], subName);
                        return `${subName}[]`;
                    }
                    return `${typeOfFirst}[]`;
                }
                if (typeof val === "object") {
                    const subName = capitalize(keyName);
                    generateInterface(val, subName);
                    return subName;
                }
                return typeof val;
            };

            const generateInterface = (obj: any, interfaceName: string) => {
                const cleanName = interfaceName || "NestedObject";
                if (seenNames.has(cleanName)) return;
                seenNames.add(cleanName);

                let code = `export interface ${cleanName} {\n`;
                for (const key of Object.keys(obj)) {
                    const cleanKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
                    const typeStr = getTypeName(obj[key], key);
                    code += `  ${cleanKey}: ${typeStr};\n`;
                }
                code += "}\n";
                interfaces.push(code);
            };

            generateInterface(parsed, rootName || "RootObject");
            setTsOutput(interfaces.reverse().join("\n"));
        } catch (err: any) {
            setError(err.message || "Failed to parse JSON. Please check syntax.");
            setTsOutput("");
        }
    }, [jsonInput, rootName]);

    useEffect(() => {
        convertJsonToTs();
    }, [jsonInput, rootName, convertJsonToTs]);

    const copyToClipboard = async () => {
        if (!tsOutput) return;
        try {
            await navigator.clipboard.writeText(tsOutput);
            setCopiedFormat("typescript");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("TypeScript interfaces copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setJsonInput("");
        setTsOutput("");
        setError("");
    };

    const downloadCode = () => {
        if (!tsOutput) return;
        const blob = new Blob([tsOutput], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${rootName || "interfaces"}.ts`;
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
                <span>🔒 100% Client-Side Sandbox: Code generation runs locally inside browser RAM. No payloads are sent to any API servers.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON to TypeScript Converter</h2>
                        <p className="text-xs text-muted-foreground">Instantly map raw JSON structures to clean TypeScript interfaces locally</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Root Options
                        </h4>

                        <div className="space-y-2">
                            <Label htmlFor="root-name-input" className="text-[10px] font-bold text-muted-foreground uppercase">Root Name</Label>
                            <Input 
                                id="root-name-input"
                                type="text"
                                value={rootName}
                                onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_$]/g, ""))}
                                className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                placeholder="RootObject"
                            />
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="json-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source JSON Payloads
                        </Label>
                        <Textarea 
                            id="json-input"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                            placeholder="Paste your raw JSON code here..."
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> TypeScript Types
                            </Label>
                            {tsOutput && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "typescript" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
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
                                {tsOutput ? (
                                    <pre className="whitespace-pre">{tsOutput}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        TypeScript interfaces will be rendered here.
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
