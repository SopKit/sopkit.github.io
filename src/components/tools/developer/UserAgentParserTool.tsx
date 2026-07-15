"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Monitor, 
    ShieldCheck, 
    Terminal, 
    Laptop, 
    Cpu, 
    Languages, 
    Wifi, 
    Check, 
    Copy,
    Settings,
    Grid,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UAInfo {
    userAgent: string;
    browser: string;
    browserVer: string;
    os: string;
    osVer: string;
    engine: string;
    deviceType: string;
}

export default function UserAgentParserTool() {
    const [uaInput, setUaInput] = useState("");
    const [parsedData, setParsedData] = useState<UAInfo | null>(null);
    const [clientSpecs, setClientSpecs] = useState<any>(null);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const parseUA = useCallback((uaStr: string) => {
        if (!uaStr.trim()) return;

        let browser = "Unknown Browser";
        let browserVer = "";
        let os = "Unknown OS";
        let osVer = "";
        let engine = "Unknown Engine";
        let deviceType = "Desktop";

        const ua = uaStr.toLowerCase();

        // Browser Detection
        if (ua.includes("edg/")) {
            browser = "Microsoft Edge";
            browserVer = uaStr.match(/edg\/([\d.]+)/i)?.[1] || "";
        } else if (ua.includes("opr/") || ua.includes("opera/")) {
            browser = "Opera";
            browserVer = uaStr.match(/(?:opr|opera)\/([\d.]+)/i)?.[1] || "";
        } else if (ua.includes("chrome") || ua.includes("crios")) {
            browser = "Google Chrome";
            browserVer = uaStr.match(/(?:chrome|crios)\/([\d.]+)/i)?.[1] || "";
        } else if (ua.includes("firefox") || ua.includes("fxios")) {
            browser = "Mozilla Firefox";
            browserVer = uaStr.match(/(?:firefox|fxios)\/([\d.]+)/i)?.[1] || "";
        } else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")) {
            browser = "Apple Safari";
            browserVer = uaStr.match(/version\/([\d.]+)/i)?.[1] || "";
        }

        // OS Detection
        if (ua.includes("windows")) {
            os = "Windows";
            osVer = uaStr.match(/windows nt ([\d._]+)/i)?.[1] || "";
        } else if (ua.includes("macintosh") || ua.includes("mac os x")) {
            os = "macOS";
            osVer = uaStr.match(/mac os x ([\d._]+)/i)?.[1]?.replace(/_/g, ".") || "";
        } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
            os = "iOS";
            osVer = uaStr.match(/os ([\d._]+)/i)?.[1]?.replace(/_/g, ".") || "";
            deviceType = ua.includes("ipad") ? "Tablet" : "Mobile";
        } else if (ua.includes("android")) {
            os = "Android";
            osVer = uaStr.match(/android ([\d._]+)/i)?.[1] || "";
            deviceType = ua.includes("mobile") ? "Mobile" : "Tablet";
        } else if (ua.includes("linux")) {
            os = "Linux";
        }

        // Engine Detection
        if (ua.includes("applewebkit")) {
            engine = "WebKit (Blink)";
        } else if (ua.includes("gecko") && !ua.includes("like gecko")) {
            engine = "Gecko";
        } else if (ua.includes("trident")) {
            engine = "Trident";
        }

        // Bot Detection
        if (/bot|googlebot|crawler|spider|robot|crawling/i.test(ua)) {
            deviceType = "Crawler Bot";
        }

        setParsedData({
            userAgent: uaStr,
            browser,
            browserVer,
            os,
            osVer,
            engine,
            deviceType
        });
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentUA = window.navigator.userAgent;
            setUaInput(currentUA);
            parseUA(currentUA);

            // Fetch extra hardware specifications from window
            setClientSpecs({
                screenSize: `${window.screen.width} x ${window.screen.height} (${window.devicePixelRatio}x)`,
                cores: window.navigator.hardwareConcurrency || "N/A",
                ram: (window.navigator as any).deviceMemory ? `${(window.navigator as any).deviceMemory} GB` : "N/A",
                language: window.navigator.language || "N/A",
                cookies: window.navigator.cookieEnabled ? "Enabled" : "Disabled",
                online: window.navigator.onLine ? "Online" : "Offline"
            });
        }
    }, [parseUA]);

    const copyToClipboard = async () => {
        if (!parsedData) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify({ parsedData, clientSpecs }, null, 2));
            setCopiedFormat("specs");
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success("Device specifications copied to clipboard.");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: User Agent diagnostics are processed entirely in browser memory. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Monitor className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">User Agent Parser & Client Info</h2>
                        <p className="text-xs text-muted-foreground">Parse agent headers, detect OS versions, screen parameters, and browser specs locally</p>
                    </div>
                </div>
                {parsedData && (
                    <Button 
                        onClick={copyToClipboard}
                        className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {copiedFormat === "specs" ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                        Copy Specs JSON
                    </Button>
                )}
            </div>

            {/* Client Diagnostics Grid */}
            {parsedData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in">
                    <Card className="p-4 border border-border/30 bg-card/10 flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-primary shrink-0" />
                        <div className="text-xs leading-none">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">Operating System</span>
                            <span className="font-bold text-foreground">{parsedData.os} {parsedData.osVer}</span>
                        </div>
                    </Card>
                    <Card className="p-4 border border-border/30 bg-card/10 flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-primary shrink-0" />
                        <div className="text-xs leading-none">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">Browser</span>
                            <span className="font-bold text-foreground">{parsedData.browser} {parsedData.browserVer}</span>
                        </div>
                    </Card>
                    <Card className="p-4 border border-border/30 bg-card/10 flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-primary shrink-0" />
                        <div className="text-xs leading-none">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">Render Engine</span>
                            <span className="font-bold text-foreground">{parsedData.engine}</span>
                        </div>
                    </Card>
                    <Card className="p-4 border border-border/30 bg-card/10 flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-primary shrink-0" />
                        <div className="text-xs leading-none">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase block mb-1">Device Category</span>
                            <span className="font-bold text-foreground">{parsedData.deviceType}</span>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* User Agent Input Text Field */}
                <div className="lg:col-span-3 space-y-4">
                    <Label htmlFor="ua-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 px-1">
                        <Settings className="w-3.5 h-3.5" /> User Agent String
                    </Label>
                    <div className="flex gap-2">
                        <Input 
                            id="ua-input"
                            type="text"
                            value={uaInput}
                            onChange={(e) => {
                                setUaInput(e.target.value);
                                parseUA(e.target.value);
                            }}
                            className="h-10 text-xs border-border/30 bg-background/50 font-mono"
                            placeholder="Enter User Agent string here..."
                        />
                    </div>

                    {/* Local client specifications */}
                    {clientSpecs && (
                        <Card className="p-6 border border-border/35 bg-card/10 rounded-2xl space-y-4 shadow-sm">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Grid className="w-3.5 h-3.5 text-primary" /> Browser Sandbox Parameters
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                                <div className="space-y-1">
                                    <span className="text-[9px] text-muted-foreground uppercase block">Screen Resolution</span>
                                    <span className="text-foreground">{clientSpecs.screenSize}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] text-muted-foreground uppercase block">Device Memory</span>
                                    <span className="text-foreground">{clientSpecs.ram}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] text-muted-foreground uppercase block">Logical Cores</span>
                                    <span className="text-foreground">{clientSpecs.cores}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] text-muted-foreground uppercase block">Browser Language</span>
                                    <span className="text-foreground">{clientSpecs.language}</span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* System Specs List card */}
                {clientSpecs && (
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Languages className="w-4 h-4 text-primary" /> Sandbox Status
                            </h3>

                            <div className="space-y-3.5 text-xs font-semibold">
                                <div className="flex items-center justify-between p-3 border border-border/10 rounded-xl bg-background/50">
                                    <span>Network Status</span>
                                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold">{clientSpecs.online}</Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 border border-border/10 rounded-xl bg-background/50">
                                    <span>Cookies Enabled</span>
                                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold">{clientSpecs.cookies}</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
