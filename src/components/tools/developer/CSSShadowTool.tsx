"use client";

import { useState, useMemo } from "react";
import { 
    Layers, 
    Copy, 
    Check, 
    Plus, 
    Trash2, 
    Settings,
    Grid,
    Sparkles,
    ShieldCheck,
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const SHADOW_PRESETS = [
    { name: "Soft Glow", h: 0, v: 4, blur: 20, spread: 0, opacity: 15, inset: false },
    { name: "Hard Border", h: 4, v: 4, blur: 0, spread: 0, opacity: 100, inset: false },
    { name: "Deep Shadow", h: 10, v: 15, blur: 30, spread: -5, opacity: 25, inset: false },
    { name: "Neumorphic Inset", h: 6, v: 6, blur: 12, spread: 0, opacity: 20, inset: true }
];

export default function CSSShadowTool() {
    const [hOffset, setHOffset] = useState(4);
    const [vOffset, setVOffset] = useState(4);
    const [blur, setBlur] = useState(16);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState("#000000");
    const [opacity, setOpacity] = useState(25);
    const [inset, setInset] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const shadowValue = useMemo(() => {
        let r = 0, g = 0, b = 0;
        const hex = color.replace("#", "");
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }
        const a = (opacity / 100).toFixed(2);
        return `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px rgba(${isNaN(r) ? 0 : r}, ${isNaN(g) ? 0 : g}, ${isNaN(b) ? 0 : b}, ${a})`;
    }, [hOffset, vOffset, blur, spread, color, opacity, inset]);

    const cssCode = `box-shadow: ${shadowValue};`;
    const tailwindSnippet = `shadow-[${inset ? "inset_" : ""}${hOffset}px_${vOffset}px_${blur}px_${spread}px_rgba(0,0,0,${(opacity/100).toFixed(2)})]`;

    const copyToClipboard = async (text: string, formatId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(formatId);
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied ${formatId.toUpperCase()} shadow code.`);
        } catch (err) {
            console.error(err);
        }
    };

    const applyPreset = (preset: typeof SHADOW_PRESETS[number]) => {
        setHOffset(preset.h);
        setVOffset(preset.v);
        setBlur(preset.blur);
        setSpread(preset.spread);
        setOpacity(preset.opacity);
        setInset(preset.inset);
        toast.success(`Preset "${preset.name}" loaded.`);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Shadow parameters are calculated locally in your browser memory. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">CSS Shadow Generator</h2>
                        <p className="text-xs text-muted-foreground">Adjust offsets, blur, spread, and opacities to export modern Box Shadow configurations locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Preview & Presets Panel */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Live Preview */}
                    <Card className="p-8 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm flex items-center justify-center min-h-[220px]">
                        <div 
                            className="w-40 h-40 rounded-3xl bg-background border border-border/10 transition-shadow duration-300"
                            style={{ boxShadow: shadowValue }}
                        />
                    </Card>

                    {/* Presets List */}
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Shadow Presets
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {SHADOW_PRESETS.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => applyPreset(p)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/30 bg-background/50 hover:border-primary/45 transition-all text-[11px] font-bold text-foreground text-center"
                                >
                                    <div 
                                        className="w-10 h-10 rounded-lg bg-background border border-border/15"
                                        style={{ 
                                            boxShadow: `${p.inset ? "inset " : ""}${p.h}px ${p.v}px ${p.blur}px ${p.spread}px rgba(0,0,0,${p.opacity/100})`
                                        }}
                                    />
                                    <span>{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Parameters */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Settings Sliders */}
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Adjustments
                        </h4>

                        <div className="space-y-3.5">
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="h-offset" className="text-muted-foreground uppercase">Horizontal Offset</Label>
                                    <span className="font-bold font-mono">{hOffset}px</span>
                                </div>
                                <input 
                                    id="h-offset"
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={hOffset}
                                    onChange={(e) => setHOffset(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="v-offset" className="text-muted-foreground uppercase">Vertical Offset</Label>
                                    <span className="font-bold font-mono">{vOffset}px</span>
                                </div>
                                <input 
                                    id="v-offset"
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={vOffset}
                                    onChange={(e) => setVOffset(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="blur" className="text-muted-foreground uppercase">Blur Radius</Label>
                                    <span className="font-bold font-mono">{blur}px</span>
                                </div>
                                <input 
                                    id="blur"
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={blur}
                                    onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="spread" className="text-muted-foreground uppercase">Spread Radius</Label>
                                    <span className="font-bold font-mono">{spread}px</span>
                                </div>
                                <input 
                                    id="spread"
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={spread}
                                    onChange={(e) => setSpread(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="opacity" className="text-muted-foreground uppercase">Opacity</Label>
                                    <span className="font-bold font-mono">{opacity}%</span>
                                </div>
                                <input 
                                    id="opacity"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-border/10 rounded-xl bg-background/50">
                                <Label htmlFor="inset-switch" className="text-xs font-bold text-foreground cursor-pointer">Inset Shadow (Inner)</Label>
                                <Switch 
                                    id="inset-switch"
                                    checked={inset} 
                                    onCheckedChange={setInset}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-7 h-7 rounded border border-border/20 cursor-pointer shrink-0"
                                />
                                <Input 
                                    type="text" 
                                    value={color} 
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-8 text-xs border-border/30 bg-background/50 font-mono font-bold"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Export Codes Panel */}
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-primary" /> CSS Output
                        </h4>

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Raw CSS Code</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => copyToClipboard(cssCode, "css")}
                                        className="h-6 text-[9px] font-bold px-2 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "css" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                </div>
                                <Input 
                                    readOnly 
                                    value={cssCode} 
                                    className="font-mono text-[10px] h-9 bg-background/50 border-border/30"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tailwind Arbitrary Class</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => copyToClipboard(tailwindSnippet, "tailwind")}
                                        className="h-6 text-[9px] font-bold px-2 rounded-lg border hover:bg-muted"
                                    >
                                        {copiedFormat === "tailwind" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-primary" />}
                                    </Button>
                                </div>
                                <Input 
                                    readOnly 
                                    value={tailwindSnippet} 
                                    className="font-mono text-[10px] h-9 bg-background/50 border-border/30"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
