"use client";

import { useState, useEffect } from "react";
import { 
    Key, 
    Copy, 
    Check, 
    Trash2, 
    Sparkles, 
    ShieldCheck, 
    Settings,
    Clock,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { decode } from "@sopkit/jwt";

export default function JWTDecoderTool() {
    const [jwtInput, setJwtInput] = useState<string>(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
    const [header, setHeader] = useState<string>("");
    const [payload, setPayload] = useState<string>("");
    const [signature, setSignature] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [expiryDate, setExpiryDate] = useState<string | null>(null);

    const handleDecode = () => {
        const token = jwtInput.trim();
        if (!token) {
            setHeader("");
            setPayload("");
            setSignature("");
            setIsValid(null);
            setExpiryDate(null);
            return;
        }

        try {
            const result = decode(token);
            setHeader(JSON.stringify(result.header, null, 2));
            setPayload(JSON.stringify(result.payload, null, 2));
            setSignature(result.signature || "");
            setIsValid(true);

            // Parse exp (expiry claim) if present
            if (result.payload && typeof result.payload.exp === "number") {
                const expTimestamp = result.payload.exp * 1000; // convert to ms
                const date = new Date(expTimestamp);
                setExpiryDate(date.toLocaleString());
            } else {
                setExpiryDate(null);
            }
            toast.success("Token decoded successfully!");
        } catch (error) {
            setIsValid(false);
            setHeader("");
            setPayload("");
            setSignature("");
            setExpiryDate(null);
        }
    };

    useEffect(() => {
        handleDecode();
    }, [jwtInput]);

    const copyText = async (text: string, formatId: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(formatId);
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied ${formatId.toUpperCase()} to clipboard.`);
        } catch (err) {
            console.error(err);
        }
    };

    const clearInput = () => {
        setJwtInput("");
        setHeader("");
        setPayload("");
        setSignature("");
        setIsValid(null);
        setExpiryDate(null);
    };

    const loadSample = () => {
        setJwtInput("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        toast.success("Loaded sample HS256 JWT.");
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your credentials and tokens are decoded locally in your browser memory. We never sell your data or log it.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Key className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">JWT Token Decoder</h2>
                        <p className="text-xs text-muted-foreground">Decode, verify, and inspect claims and parameters of JSON Web Tokens locally</p>
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
                        onClick={clearInput}
                        className="border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                </div>
            </div>

            {isValid === false && (
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-destructive">Invalid Token Format</p>
                        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                            The input token is not a valid 3-part Base64Url-encoded JWT payload.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Token Input Textarea */}
                <div className="lg:col-span-2 space-y-4">
                    <Label htmlFor="jwt-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                        <Settings className="w-3.5 h-3.5" /> Encoded Token String
                    </Label>
                    <Textarea 
                        id="jwt-input"
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[380px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4 text-rose-500"
                        placeholder="Paste your JWT encoded string here..."
                    />
                    
                    {expiryDate && (
                        <Card className="p-4 border border-border/30 bg-card/10 rounded-2xl flex items-center gap-3">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <div className="text-xs leading-none">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Expiration time</span>
                                <span className="font-bold text-foreground">{expiryDate}</span>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Decoded sections layout */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Decoded Header */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Header (Algorithm & Type)</Label>
                            {header && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyText(header, "header")}
                                    className="h-6 text-[9px] font-bold gap-1 px-2 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "header" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                </Button>
                            )}
                        </div>
                        <Card className="border border-border/20 bg-muted/5 rounded-xl overflow-hidden">
                            <div className="p-4 font-mono text-xs text-rose-500 bg-white select-text overflow-x-auto min-h-[60px]">
                                {header ? <pre className="whitespace-pre">{header}</pre> : <span className="text-muted-foreground italic">No Header</span>}
                            </div>
                        </Card>
                    </div>

                    {/* Decoded Payload */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold text-muted-foreground uppercase">Payload (Data Claims)</Label>
                            {payload && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyText(payload, "payload")}
                                    className="h-6 text-[9px] font-bold gap-1 px-2 rounded-lg border hover:bg-muted"
                                >
                                    {copiedFormat === "payload" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                </Button>
                            )}
                        </div>
                        <Card className="border border-border/20 bg-muted/5 rounded-xl overflow-hidden">
                            <div className="p-4 font-mono text-xs text-sky-500 bg-white select-text overflow-x-auto min-h-[140px]">
                                {payload ? <pre className="whitespace-pre">{payload}</pre> : <span className="text-muted-foreground italic">No Payload</span>}
                            </div>
                        </Card>
                    </div>

                    {/* Signature block */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase px-1">Signature</Label>
                        <Card className="border border-border/20 bg-muted/5 rounded-xl overflow-hidden">
                            <div className="p-4 font-mono text-xs text-emerald-500 bg-white select-text overflow-x-auto break-all min-h-[50px]">
                                {signature ? <pre className="whitespace-pre-wrap">{signature}</pre> : <span className="text-muted-foreground italic">No Signature</span>}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
