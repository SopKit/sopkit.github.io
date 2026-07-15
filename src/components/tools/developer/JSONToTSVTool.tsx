"use client";

import { useState, useEffect, useCallback } from "react";
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
    Sparkles,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function JSONToTSVTool() {
    const [jsonInput, setJsonInput] = useState<string>(JSON.stringify([
        { id: 1, name: "John Doe", contact: { email: "john@example.com", phone: "123-456" } },
        { id: 2, name: "Jane Smith", contact: { email: "jane@example.com", phone: "987-654" } }
    ], null, 2));

    const [convertedOutput, setConvertedOutput] = useState("");
    const [delimiter, setDelimiter] = useState<"csv" | "tsv">("tsv");
    const [flattenObjects, setFlattenObjects] = useState(true);
    const [includeHeaders, setIncludeHeaders] = useState(true);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");

    const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
        const flattened: Record<string, any> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const propName = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(flattened, flattenObject(obj[key], propName));
                } else {
                    flattened[propName] = obj[key];
                }
            }
        }
        return flattened;
    };

    const runConversion = useCallback(() => {
        const text = jsonInput.trim();
        if (!text) {
            setConvertedOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const arrayData = Array.isArray(parsed) ? parsed : [parsed];
            
            if (arrayData.length === 0) {
                setConvertedOutput("");
                setError("");
                return;
            }

            // Flatten data rows if specified
            const processedRows = flattenObjects 
                ? arrayData.map(item => flattenObject(item))
                : arrayData;

            // Get all unique header columns
            const headersSet = new Set<string>();
            processedRows.forEach(row => {
                Object.keys(row).forEach(k => headersSet.add(k));
            });
            const headers = Array.from(headersSet);

            const delimiterChar = delimiter === "csv" ? "," : "\t";
            const fileRows: string[] = [];

            // Add Header Row
            if (includeHeaders) {
                fileRows.push(headers.join(delimiterChar));
            }

            // Add Data Rows
            processedRows.forEach(row => {
                const line = headers.map(headerName => {
                    const cellVal = row[headerName];
                    if (cellVal === undefined || cellVal === null) return "";
                    
                    const strVal = typeof cellVal === "object" ? JSON.stringify(cellVal) : String(cellVal);
                    // Quote string values containing delimiter or newlines
                    if (strVal.includes(delimiterChar) || strVal.includes("\n") || strVal.includes('"')) {
                        return `"${strVal.replace(/"/g, '""')}"`;
                    }
                    return strVal;
                });
                fileRows.push(line.join(delimiterChar));
            });

            setConvertedOutput(fileRows.join("\n"));
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to convert JSON. Verify array of objects structure.");
            setConvertedOutput("");
        }
    }, [jsonInput, delimiter, flattenObjects, includeHeaders]);

    useEffect(() => {
        runConversion();
    }, [jsonInput, delimiter, flattenObjects, includeHeaders, runConversion]);

    const copyToClipboard = async () => {
        if (!convertedOutput) return;
        try {
            await navigator.clipboard.writeText(convertedOutput);
            setCopiedFormat("converted");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied ${delimiter.toUpperCase()} data to clipboard.`);
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setJsonInput("");
        setConvertedOutput("");
        setError("");
    };

    const downloadFile = () => {
        if (!convertedOutput) return;
        const blob = new Blob([convertedOutput], { type: delimiter === "csv" ? "text/csv" : "text/tab-separated-values" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `converted_data.${delimiter}`;
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
                <span>🔒 100% Client-Side Sandbox: Conversion runs locally in browser RAM. No spreadsheet data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <FileJson className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON to CSV / TSV Converter</h2>
                        <p className="text-xs text-muted-foreground">Convert raw JSON object structures to standard spreadsheet CSV or TSV data sheets locally</p>
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
                            <Settings className="w-3.5 h-3.5" /> Conversion settings
                        </h4>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="delimiter-select" className="text-[10px] font-bold text-muted-foreground uppercase">Target Format</Label>
                                <select
                                    id="delimiter-select"
                                    value={delimiter}
                                    onChange={(e) => setDelimiter(e.target.value as "csv" | "tsv")}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="tsv">TSV (Tab-Separated)</option>
                                    <option value="csv">CSV (Comma-Separated)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="headers-select" className="text-[10px] font-bold text-muted-foreground uppercase">Header Row</Label>
                                <select
                                    id="headers-select"
                                    value={includeHeaders ? "true" : "false"}
                                    onChange={(e) => setIncludeHeaders(e.target.value === "true")}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="true">Include column headers</option>
                                    <option value="false">Omit column headers</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nesting-select" className="text-[10px] font-bold text-muted-foreground uppercase">Nested Keys</Label>
                                <select
                                    id="nesting-select"
                                    value={flattenObjects ? "true" : "false"}
                                    onChange={(e) => setFlattenObjects(e.target.value === "true")}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="true">Flatten nested objects (user.name)</option>
                                    <option value="false">Output raw object strings</option>
                                </select>
                            </div>
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
                            placeholder="Paste your JSON array of objects here..."
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Spreadsheet Output
                            </Label>
                            {convertedOutput && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "converted" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={downloadFile}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        <Download className="w-3 h-3 text-primary" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[380px] flex flex-col bg-white">
                            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                                {convertedOutput ? (
                                    <pre className="whitespace-pre">{convertedOutput}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Converted CSV / TSV spreadsheet rows will be rendered here.
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
