"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Upload, 
    Download, 
    Database,
    Loader2,
    ShieldCheck,
    Check,
    Copy,
    Trash2,
    Settings,
    Grid,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DIALECTS = [
    { value: "sql", label: "Standard SQL" },
    { value: "mysql", label: "MySQL" },
    { value: "postgresql", label: "PostgreSQL" },
    { value: "sqlite", label: "SQLite" },
    { value: "mariadb", label: "MariaDB" },
    { value: "tsql", label: "Transact-SQL (T-SQL)" },
    { value: "plsql", label: "Oracle PL/SQL" },
    { value: "db2", label: "IBM DB2" },
    { value: "redshift", label: "Amazon Redshift" },
    { value: "spark", label: "Spark SQL" },
    { value: "bigquery", label: "Google BigQuery" },
];

const DEFAULT_SQL = `SELECT users.id, users.name, SUM(orders.total) AS total_spent, orders.created_at FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.status = 'completed' AND orders.total > 100 GROUP BY users.id, users.name, orders.created_at ORDER BY total_spent DESC, orders.created_at ASC LIMIT 10;`;

export default function SQLFormatterTool() {
    const [sqlInput, setSqlInput] = useState(DEFAULT_SQL);
    const [sqlOutput, setSqlOutput] = useState("");
    const [dialect, setDialect] = useState("sql");
    const [indentSize, setIndentSize] = useState<string>("2");
    const [keywordCase, setKeywordCase] = useState("upper");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const formatSql = useCallback(async () => {
        if (!sqlInput.trim()) {
            setSqlOutput("");
            setError("");
            return;
        }

        setIsProcessing(true);
        setError("");
        try {
            const sqlFormatter = await import("sql-formatter");
            const formatted = sqlFormatter.format(sqlInput, {
                language: dialect as any,
                tabWidth: parseInt(indentSize, 10) || 2,
                keywordCase: keywordCase === "preserve" ? undefined : keywordCase as any,
            });
            setSqlOutput(formatted);
        } catch (err: any) {
            setError(err.message || "Failed to format SQL query. Check syntax.");
            setSqlOutput("");
        } finally {
            setIsProcessing(false);
        }
    }, [sqlInput, dialect, indentSize, keywordCase]);

    useEffect(() => {
        formatSql();
    }, [sqlInput, dialect, indentSize, keywordCase, formatSql]);

    const copyToClipboard = async () => {
        if (!sqlOutput) return;
        try {
            await navigator.clipboard.writeText(sqlOutput);
            setCopiedFormat("formatted");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("SQL query copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = () => {
        setSqlInput("");
        setSqlOutput("");
        setError("");
    };

    const downloadCode = () => {
        if (!sqlOutput) return;
        const blob = new Blob([sqlOutput], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `formatted_query.sql`;
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
                <span>🔒 100% Client-Side Sandbox: SQL formatting is processed locally in browser RAM. No script data leaves your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Database className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">SQL Query Formatter</h2>
                        <p className="text-xs text-muted-foreground">Format and beautify complex SQL statements for PostgreSQL, MySQL, SQLite, and more locally</p>
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
                <Card className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl text-xs font-mono text-destructive">
                    {error}
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs font-semibold">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5 text-primary" /> Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="dialect-select" className="text-[10px] font-bold text-muted-foreground uppercase">Dialect</Label>
                                <select
                                    id="dialect-select"
                                    value={dialect}
                                    onChange={(e) => setDialect(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    {DIALECTS.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="indent-select" className="text-[10px] font-bold text-muted-foreground uppercase">Indentation</Label>
                                <select
                                    id="indent-select"
                                    value={indentSize}
                                    onChange={(e) => setIndentSize(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="2">2 Spaces</option>
                                    <option value="4">4 Spaces</option>
                                    <option value="8">8 Spaces</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="case-select" className="text-[10px] font-bold text-muted-foreground uppercase">Keywords Case</Label>
                                <select
                                    id="case-select"
                                    value={keywordCase}
                                    onChange={(e) => setKeywordCase(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="upper">UPPERCASE</option>
                                    <option value="lower">lowercase</option>
                                    <option value="preserve">preserve original</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Panels */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3.5">
                        <Label htmlFor="sql-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                            <Settings className="w-3.5 h-3.5" /> Source SQL Query
                        </Label>
                        <Textarea 
                            id="sql-input"
                            value={sqlInput}
                            onChange={(e) => setSqlInput(e.target.value)}
                            className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                            placeholder="Paste your raw SQL query here..."
                        />
                    </div>

                    <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Formatted SQL Output
                            </Label>
                            {sqlOutput && (
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
                                {isProcessing ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        <span className="text-[10px] text-muted-foreground animate-pulse">Formatting...</span>
                                    </div>
                                ) : sqlOutput ? (
                                    <pre className="whitespace-pre">{sqlOutput}</pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                                        Formatted SQL will appear here automatically.
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
