"use client";

import { useState } from "react";
import { 
    KeyRound, 
    ShieldCheck, 
    AlertCircle, 
    Loader2, 
    CheckCircle2, 
    Settings,
    Grid,
    Globe,
    Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ApiKeyTester({ toolName = "OpenAI API Key" }: { toolName?: string }) {
    const [apiKey, setApiKey] = useState("");
    const [platform, setPlatform] = useState<string>(() => {
        const clean = toolName.toLowerCase();
        if (clean.includes("openai")) return "openai";
        if (clean.includes("gemini")) return "gemini";
        if (clean.includes("stripe")) return "stripe";
        if (clean.includes("groq")) return "groq";
        if (clean.includes("deepseek")) return "deepseek";
        return "custom";
    });

    const [customUrl, setCustomUrl] = useState("");
    const [customMethod, setCustomMethod] = useState("GET");
    const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const handleTest = async () => {
        if (!apiKey.trim()) {
            setStatus("error");
            setMessage("Please enter an API Key string to check.");
            return;
        }

        setStatus("testing");
        setStatusCode(null);
        setMessage("");

        let targetUrl = "";
        let headers: Record<string, string> = {};
        let body: string | null = null;

        if (platform === "openai") {
            targetUrl = "https://api.openai.com/v1/models";
            headers = { "Authorization": `Bearer ${apiKey}` };
        } else if (platform === "gemini") {
            targetUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        } else if (platform === "stripe") {
            targetUrl = "https://api.stripe.com/v1/charges?limit=1";
            headers = { "Authorization": `Bearer ${apiKey}` };
        } else if (platform === "groq") {
            targetUrl = "https://api.groq.com/openai/v1/models";
            headers = { "Authorization": `Bearer ${apiKey}` };
        } else if (platform === "deepseek") {
            targetUrl = "https://api.deepseek.com/models";
            headers = { "Authorization": `Bearer ${apiKey}` };
        } else {
            targetUrl = customUrl || "";
            headers = { "Authorization": `Bearer ${apiKey}` };
        }

        if (!targetUrl) {
            setStatus("error");
            setMessage("Please specify a valid test endpoint URL.");
            return;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const res = await fetch(targetUrl, {
                method: platform === "custom" ? customMethod : "GET",
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            setStatusCode(res.status);

            if (res.status === 200 || res.status === 201) {
                setStatus("success");
                setMessage(`✓ Success! The API Key is valid and authorized (HTTP ${res.status}).`);
            } else {
                const text = await res.text();
                setStatus("error");
                setMessage(`✗ Authorization failed (HTTP ${res.status}). API Endpoint response: ${text.substring(0, 160) || "No details provided"}`);
            }
        } catch (err: any) {
            console.error(err);
            setStatus("error");
            
            if (err.name === "AbortError") {
                setMessage("✗ Connection timeout. The server didn't respond in time.");
            } else {
                setMessage(`✗ Request failed: ${err.message}. Note: Browser-based tests may trigger CORS blocks if the endpoint doesn't allow cross-origin requests.`);
            }
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Direct connections are initiated straight from your browser. We never see or store your API keys.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">API Key Tester & Diagnostics</h2>
                        <p className="text-xs text-muted-foreground">Test the validity and authorization limits of developer API keys directly from your browser locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form Inputs Panel */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-5 shadow-sm text-xs font-semibold">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> API Key Target Parameters
                        </h3>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label htmlFor="platform-select" className="text-[10px] font-bold text-muted-foreground uppercase">Target Provider</Label>
                                <select
                                    id="platform-select"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="openai">OpenAI (v1/models)</option>
                                    <option value="gemini">Google Gemini (generativelanguage)</option>
                                    <option value="stripe">Stripe (v1/charges)</option>
                                    <option value="groq">Groq (openai/v1/models)</option>
                                    <option value="deepseek">DeepSeek (models)</option>
                                    <option value="custom">Custom Endpoint Address</option>
                                </select>
                            </div>

                            {platform === "custom" && (
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="col-span-1 space-y-1.5">
                                        <Label htmlFor="custom-method" className="text-[10px] font-bold text-muted-foreground uppercase">Method</Label>
                                        <select
                                            id="custom-method"
                                            value={customMethod}
                                            onChange={(e) => setCustomMethod(e.target.value)}
                                            className="w-full h-9 px-2 rounded-lg border border-border/35 bg-background text-xs"
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                        </select>
                                    </div>
                                    <div className="col-span-3 space-y-1.5">
                                        <Label htmlFor="custom-url" className="text-[10px] font-bold text-muted-foreground uppercase">Endpoint URL</Label>
                                        <Input 
                                            id="custom-url"
                                            type="text"
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                            className="h-9 text-xs border-border/30 bg-background/50 font-mono"
                                            placeholder="https://api.example.com/v1/user"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="key-input" className="text-[10px] font-bold text-muted-foreground uppercase">API Key / Token Value</Label>
                                <Input 
                                    id="key-input"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="h-9 text-xs border-border/30 bg-background/50 font-mono"
                                    placeholder={platform === "openai" ? "sk-..." : "Paste key string..."}
                                />
                            </div>
                        </div>

                        <Button 
                            disabled={status === "testing"}
                            onClick={handleTest}
                            className="w-full bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10 mt-2 h-10"
                        >
                            {status === "testing" ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Sending test request...</>
                            ) : (
                                <><Globe className="mr-2 h-4 w-4" /> Run Connection Diagnostics</>
                            )}
                        </Button>
                    </Card>
                </div>

                {/* Status Result Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm min-h-[220px] flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                                <Terminal className="w-3.5 h-3.5" /> Diagnostic Console
                            </h3>

                            <div className="mt-4 space-y-4">
                                {status === "idle" && (
                                    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground border border-dashed border-border/20 rounded-xl bg-background/30">
                                        <KeyRound className="w-8 h-8 text-muted-foreground/45 mb-2" />
                                        <p className="text-[10px] font-bold uppercase">Console Inactive</p>
                                        <p className="text-[9px] text-muted-foreground/80 mt-1 max-w-[160px] leading-relaxed">Submit parameters to initiate API diagnostics.</p>
                                    </div>
                                )}

                                {status === "testing" && (
                                    <div className="flex flex-col items-center justify-center p-6 text-center text-primary border border-primary/10 rounded-xl bg-primary/5 animate-pulse">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                        <p className="text-[10px] font-bold uppercase">Connecting...</p>
                                    </div>
                                )}

                                {status === "success" && (
                                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-start gap-2.5">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase block">Valid API Key</span>
                                            <p className="text-[11px] font-mono leading-relaxed">{message}</p>
                                        </div>
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive rounded-xl flex items-start gap-2.5">
                                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase block">Connection Failed</span>
                                            <p className="text-[11px] font-mono leading-relaxed">{message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {statusCode !== null && (
                            <div className="text-[10px] font-bold text-muted-foreground font-mono text-right mt-2 border-t border-border/10 pt-2">
                                HTTP STATUS CODE: <span className={statusCode === 200 ? "text-emerald-500" : "text-destructive"}>{statusCode}</span>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
