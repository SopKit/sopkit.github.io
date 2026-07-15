"use client";

import { useState, useMemo } from "react";
import { 
    Layout, 
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
import { Input } from "@/components/ui/input";

const RADIUS_PRESETS = [
    { name: "Symmetric Card", tl: 16, tr: 16, br: 16, bl: 16, unit: "px" },
    { name: "Organic Blob", tl: 60, tr: 40, br: 30, bl: 70, unit: "%" },
    { name: "Egg Shape", tl: 50, tr: 50, br: 30, bl: 30, unit: "%" },
    { name: "Asymmetric Pill", tl: 30, tr: 100, br: 30, bl: 100, unit: "px" }
];

export default function CssBorderRadiusTool() {
    const [topLeft, setTopLeft] = useState(12);
    const [topRight, setTopRight] = useState(12);
    const [bottomRight, setBottomRight] = useState(12);
    const [bottomLeft, setBottomLeft] = useState(12);
    const [unit, setUnit] = useState<"px" | "%">("px");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const borderRadiusValue = useMemo(() => {
        return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
    }, [topLeft, topRight, bottomRight, bottomLeft, unit]);

    const cssCode = `border-radius: ${borderRadiusValue};\n-webkit-border-radius: ${borderRadiusValue};\n-moz-border-radius: ${borderRadiusValue};`;
    const tailwindSnippet = `rounded-[${topLeft}${unit}_${topRight}${unit}_${bottomRight}${unit}_${bottomLeft}${unit}]`;

    const copyToClipboard = async (text: string, formatId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(formatId);
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied ${formatId.toUpperCase()} border-radius code.`);
        } catch (err) {
            console.error(err);
        }
    };

    const applyPreset = (preset: typeof RADIUS_PRESETS[number]) => {
        setUnit(preset.unit as any);
        setTopLeft(preset.tl);
        setTopRight(preset.tr);
        setBottomRight(preset.br);
        setBottomLeft(preset.bl);
        toast.success(`Preset "${preset.name}" loaded.`);
    };

    const resetValues = () => {
        setTopLeft(unit === "px" ? 12 : 10);
        setTopRight(unit === "px" ? 12 : 10);
        setBottomRight(unit === "px" ? 12 : 10);
        setBottomLeft(unit === "px" ? 12 : 10);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Border radius is fully formatted in local RAM. No data is stored or logged.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Layout className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">CSS Border Radius Generator</h2>
                        <p className="text-xs text-muted-foreground">Adjust top-left, top-right, bottom-left, and bottom-right corner values to design custom CSS shapes locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Preview & Presets Panel */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Live Preview */}
                    <Card className="p-8 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm flex items-center justify-center min-h-[220px]">
                        <div 
                            className="w-40 h-40 bg-primary/20 border-2 border-primary/50 shadow-md transition-all duration-300"
                            style={{ borderRadius: borderRadiusValue }}
                        />
                    </Card>

                    {/* Presets List */}
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Corner Presets
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {RADIUS_PRESETS.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => applyPreset(p)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/30 bg-background/50 hover:border-primary/45 transition-all text-[11px] font-bold text-foreground text-center"
                                >
                                    <div 
                                        className="w-10 h-10 bg-primary/15 border border-primary/30"
                                        style={{ 
                                            borderRadius: `${p.tl}${p.unit} ${p.tr}${p.unit} ${p.br}${p.unit} ${p.bl}${p.unit}`
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
                        <div className="flex justify-between items-center border-b border-border/10 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5" /> Adjustments
                            </h4>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setUnit(unit === "px" ? "%" : "px")}
                                    className="h-6 text-[9px] font-bold px-2 rounded border hover:bg-muted"
                                >
                                    Unit: {unit}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={resetValues}
                                    className="h-6 text-[9px] font-bold px-2 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3.5">
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="tl-offset" className="text-muted-foreground uppercase">Top Left Corner</Label>
                                    <span className="font-bold font-mono">{topLeft}{unit}</span>
                                </div>
                                <input 
                                    id="tl-offset"
                                    type="range"
                                    min="0"
                                    max={unit === "px" ? "150" : "100"}
                                    value={topLeft}
                                    onChange={(e) => setTopLeft(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="tr-offset" className="text-muted-foreground uppercase">Top Right Corner</Label>
                                    <span className="font-bold font-mono">{topRight}{unit}</span>
                                </div>
                                <input 
                                    id="tr-offset"
                                    type="range"
                                    min="0"
                                    max={unit === "px" ? "150" : "100"}
                                    value={topRight}
                                    onChange={(e) => setTopRight(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="br-offset" className="text-muted-foreground uppercase">Bottom Right Corner</Label>
                                    <span className="font-bold font-mono">{bottomRight}{unit}</span>
                                </div>
                                <input 
                                    id="br-offset"
                                    type="range"
                                    min="0"
                                    max={unit === "px" ? "150" : "100"}
                                    value={bottomRight}
                                    onChange={(e) => setBottomRight(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <Label htmlFor="bl-offset" className="text-muted-foreground uppercase">Bottom Left Corner</Label>
                                    <span className="font-bold font-mono">{bottomLeft}{unit}</span>
                                </div>
                                <input 
                                    id="bl-offset"
                                    type="range"
                                    min="0"
                                    max={unit === "px" ? "150" : "100"}
                                    value={bottomLeft}
                                    onChange={(e) => setBottomLeft(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
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
                                <Textarea 
                                    readOnly 
                                    value={cssCode} 
                                    className="font-mono text-[10px] h-16 bg-background/50 border-border/30 resize-none rounded-xl"
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
