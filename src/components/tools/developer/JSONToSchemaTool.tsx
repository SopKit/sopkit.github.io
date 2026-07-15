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

export default function JSONToSchemaTool() {
    const [jsonInput, setJsonInput] = useState<string>(JSON.stringify({
        id: 1,
        title: "Product Item",
        price: 99.90,
        tags: ["electronics", "audio"],
        dimensions: {
            length: 12.5,
            width: 7.0
        }
    }, null, 2));

    const [schemaOutput, setSchemaOutput] = useState("");
    const [draftVersion, setDraftVersion] = useState("draft-07");
    const [makeRequired, setMakeRequired] = useState(true);
    const [addDescriptions, setAddDescriptions] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");

    const generateSchema = useCallback(() => {
        const text = jsonInput.trim();
        if (!text) {
            setSchemaOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(text);
            setError("");

            const schemaBase: Record<string, any> = {
                $schema: draftVersion === "draft-07" 
                    ? "http://json-schema.org/draft-07/schema#" 
                    : "http://json-schema.org/draft-04/schema#",
                type: "object"
            };

            const buildPropertiesSchema = (val: any): any => {
                const valType = Array.isArray(val) ? "array" : val === null ? "null" : typeof val;
                const nodeSchema: Record<string, any> = { type: valType };

                if (addDescriptions) {
                    nodeSchema.description = `Description for item`;
                }

                // Detect string formats
                if (valType === "string") {
                    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
                        nodeSchema.format = "date-time";
                    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                        nodeSchema.format = "email";
                    } else if (/^https?:\/\/\S+/.test(val)) {
                        nodeSchema.format = "uri";
                    }
                }

                if (valType === "object" && val !== null) {
                    nodeSchema.type = "object";
                    nodeSchema.properties = {};
                    const keys = Object.keys(val);
                    if (makeRequired && keys.length > 0) {
                        nodeSchema.required = keys;
                    }
                    for (const key of keys) {
                        nodeSchema.properties[key] = buildPropertiesSchema(val[key]);
                    }
                } else if (valType === "array") {
                    nodeSchema.type = "array";
                    if (val.length > 0) {
                        nodeSchema.items = buildPropertiesSchema(val[0]);
                    } else {
                        nodeSchema.items = { type: "string" };
                    }
                }

                return nodeSchema;
            };

            const fullProps = buildPropertiesSchema(parsed);
            Object.assign(schemaBase, fullProps);

            setSchemaOutput(JSON.stringify(schemaBase, null, 2));
        } catch (err: any) {
            setError(err.message || "Failed to parse input JSON.");
            setSchemaOutput("");
        }
    }, [jsonInput, draftVersion, makeRequired, addDescriptions]);

    useEffect(() => {
        generateSchema();
    }, [jsonInput, draftVersion, makeRequired, addDescriptions, generateSchema]);

    const copyToClipboard = async () => {
        if (!schemaOutput) return;
        try {
            await navigator.clipboard.writeText(schemaOutput);
            setCopiedFormat("schema");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("JSON Schema copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setJsonInput("");
        setSchemaOutput("");
        setError("");
    };

    const downloadSchema = () => {
        if (!schemaOutput) return;
        const blob = new Blob([schemaOutput], { type: "application/schema+json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `schema.json`;
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
                <span>🔒 100% Client-Side Sandbox: Schema generation is executed locally inside your browser context. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <FileJson className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JSON to JSON Schema Generator</h2>
                        <p className="text-xs text-muted-foreground">Map raw JSON payloads to draft-compliant schemas with required properties and patterns locally</p>
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
                        <p className="text-xs font-bold text-destructive">Invalid JSON Structure</p>
                        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Schema Options
                        </h4>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="draft-select" className="text-[10px] font-bold text-muted-foreground uppercase">Draft Specification</Label>
                                <select
                                    id="draft-select"
                                    value={draftVersion}
                                    onChange={(e) => setDraftVersion(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="draft-07">Draft-07 (Recommended)</option>
                                    <option value="draft-04">Draft-04 (Legacy)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="required-select" className="text-[10px] font-bold text-muted-foreground uppercase">Required Fields</Label>
                                <select
                                    id="required-select"
                                    value={makeRequired ? "true" : "false"}
                                    onChange={(e) => setMakeRequired(e.target.value === "true")}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="true">Mark all properties as required</option>
                                    <option value="false">All properties optional</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="desc-select" className="text-[10px] font-bold text-muted-foreground uppercase">Descriptions</Label>
                                <select
                                    id="desc-select"
                                    value={addDescriptions ? "true" : "false"}
                                    onChange={(e) => setAddDescriptions(e.target.value === "true")}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="false">Omit description placeholders</option>
                                    <option value="true">Include description tags</option>
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
                            placeholder="Paste your raw JSON code here..."
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Generated JSON Schema
                            </Label>
                            {schemaOutput && (
                                <div className="flex gap-1.5">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={copyToClipboard}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "schema" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={downloadSchema}
                                        className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                    >
                                        <Download className="w-3 h-3 text-primary" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[380px] flex flex-col bg-white">
                            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-black bg-white select-text">
                                {schemaOutput ? (
                                    <pre className="whitespace-pre">{schemaOutput}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        JSON Schema will be rendered here.
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
