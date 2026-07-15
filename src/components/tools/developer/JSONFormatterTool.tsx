"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
    RefreshCw,
    Sparkles,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JSONError {
    type: string;
    message: string;
    line?: number;
    column?: number;
    position?: number;
}

export default function JSONFormatterTool() {
    const [jsonInput, setJsonInput] = useState<string>(
        '{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","coding","gaming"],"address":{"street":"123 Main St","zipCode":"10001"}}'
    );
    const [formattedJson, setFormattedJson] = useState<string>("");
    const [minifiedJson, setMinifiedJson] = useState<string>("");
    const [isValid, setIsValid] = useState(true);
    const [errors, setErrors] = useState<JSONError[]>([]);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [indentSize, setIndentSize] = useState<number>(2);
    const [sortKeys, setSortKeys] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortObjectKeys = useCallback((obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        } else if (obj !== null && typeof obj === "object") {
            const sorted: Record<string, any> = {};
            Object.keys(obj)
                .sort()
                .forEach((key) => {
                    sorted[key] = sortObjectKeys(obj[key]);
                });
            return sorted;
        }
        return obj;
    }, []);

    const parseJSONError = useCallback((errorMessage: string, jsonText: string): JSONError[] => {
        const parsedErrors: JSONError[] = [];
        const positionMatch = errorMessage.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1], 10);
            const lines = jsonText.substring(0, position).split("\n");
            const lineNumber = lines.length;
            const columnNumber = lines[lines.length - 1].length + 1;

            parsedErrors.push({
                type: "Syntax Error",
                message: errorMessage,
                line: lineNumber,
                column: columnNumber,
                position,
            });
        } else {
            parsedErrors.push({
                type: "Parse Error",
                message: errorMessage,
            });
        }
        return parsedErrors;
    }, []);

    const validateAndFormat = useCallback((jsonText: string) => {
        if (!jsonText.trim()) {
            setFormattedJson("");
            setMinifiedJson("");
            setIsValid(true);
            setErrors([]);
            return;
        }

        try {
            const parsed = JSON.parse(jsonText);
            const processedObj = sortKeys ? sortObjectKeys(parsed) : parsed;
            const formatted = JSON.stringify(processedObj, null, indentSize);
            const minified = JSON.stringify(processedObj);

            setFormattedJson(formatted);
            setMinifiedJson(minified);
            setIsValid(true);
            setErrors([]);
        } catch (error: any) {
            setIsValid(false);
            setFormattedJson("");
            setMinifiedJson("");
            setErrors(parseJSONError(error.message || "Failed to parse JSON", jsonText));
        }
    }, [indentSize, sortKeys, sortObjectKeys, parseJSONError]);

    useEffect(() => {
        validateAndFormat(jsonInput);
    }, [jsonInput, indentSize, sortKeys, validateAndFormat]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setJsonInput(content);
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
            toast.success(`Copied ${formatId.toUpperCase()} JSON to clipboard.`);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadJSON = (content: string, filename: string) => {
        if (!content) return;
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${filename} successfully.`);
    };

    const clearInput = () => {
        setJsonInput("");
        setFormattedJson("");
        setMinifiedJson("");
        setIsValid(true);
        setErrors([]);
    };

    const loadSample = () => {
        const sampleObj = {
            user: {
                id: 42091,
                name: "Sarah Parker",
                email: "sarah.parker@sandbox.local",
                isActive: true,
                preferences: {
                    theme: "dark",
                    languages: ["en", "de"],
                    notifications: { email: true, push: false }
                }
            },
            services: [
                { name: "WasmEngine", status: "running", uptime: 86400 },
                { name: "ClientStorage", status: "idle", uptime: 0 }
            ]
        };
        setJsonInput(JSON.stringify(sampleObj, null, 2));
        toast.success("Loaded sample JSON payload.");
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: JSON parsing and validation run entirely in browser memory. No data is stored or transmitted.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <FileJson className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON Formatter & Validator</h2>
                        <p className="text-xs text-muted-foreground">Prettify, validate, sort, and minify JSON data payloads locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={loadSample}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Sparkles className="mr-2 h-4 w-4" /> Load Sample
                    </Button>
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
                    <input 
                        type="file" 
                        accept="application/json" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Validation Alerts */}
            {!isValid && errors.length > 0 && (
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-destructive">Invalid JSON Layout Detected</p>
                        {errors.map((err, i) => (
                            <p key={i} className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                                {err.message} {err.line && `at line ${err.line}, col ${err.column}`}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Editor */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <Label htmlFor="json-raw-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5" /> Raw Input
                        </Label>
                    </div>
                    <Textarea 
                        id="json-raw-input"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[480px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Paste your raw JSON code here..."
                    />
                </div>

                {/* Prettified Output */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <FileJson className="w-3.5 h-3.5" /> Prettified JSON Output
                        </Label>
                        {isValid && formattedJson && (
                            <div className="flex gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(formattedJson, "pretty")}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "pretty" ? (
                                        <><Check className="w-3 h-3 text-emerald-500" /> Copied</>
                                    ) : (
                                        <><Copy className="w-3 h-3 text-primary" /> Copy</>
                                    )}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => downloadJSON(formattedJson, "formatted.json")}
                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                >
                                    <Download className="w-3 h-3 text-primary" /> Download
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[480px] flex flex-col bg-white">
                        <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                            {formattedJson ? (
                                <pre className="whitespace-pre">{formattedJson}</pre>
                            ) : (
                                <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                    Prettified output will appear here automatically when valid JSON is supplied.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Formatting Configuration Options */}
            <Card className="p-6 border border-border/30 bg-card/10 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-4">
                    <Grid className="w-3.5 h-3.5" /> Formatting Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                    <div className="space-y-2">
                        <Label htmlFor="indent-size" className="text-xs text-foreground">Indent Spacing</Label>
                        <select
                            id="indent-size"
                            value={indentSize}
                            onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
                            className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                        >
                            <option value="2">2 Spaces</option>
                            <option value="4">4 Spaces</option>
                            <option value="8">8 Spaces</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sort-keys" className="text-xs text-foreground">Object Keys Sorting</Label>
                        <select
                            id="sort-keys"
                            value={sortKeys ? "true" : "false"}
                            onChange={(e) => setSortKeys(e.target.value === "true")}
                            className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                        >
                            <option value="false">Original Order</option>
                            <option value="true">Alphabetical Order</option>
                        </select>
                    </div>

                    {isValid && minifiedJson && (
                        <div className="space-y-2">
                            <Label className="text-xs text-foreground">Minified JSON</Label>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => copyToClipboard(minifiedJson, "minify")}
                                    className="flex-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 text-xs font-bold h-9"
                                >
                                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Minified
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => downloadJSON(minifiedJson, "minified.json")}
                                    className="border-border text-xs font-bold h-9"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
