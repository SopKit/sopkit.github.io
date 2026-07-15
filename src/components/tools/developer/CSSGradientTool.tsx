"use client";

import { useState, useMemo } from "react";
import { 
    Paintbrush, 
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

const GRADIENT_PRESETS = [
    { name: "Ocean Breeze", type: "linear", angle: 135, stops: [{ color: "#00c6ff", position: 0 }, { color: "#0072ff", position: 100 }] },
    { name: "Sunset Glow", type: "linear", angle: 135, stops: [{ color: "#f857a6", position: 0 }, { color: "#ff5858", position: 100 }] },
    { name: "Neon Lime", type: "linear", angle: 45, stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }] },
    { name: "Purple Dream", type: "linear", angle: 90, stops: [{ color: "#8a2be2", position: 0 }, { color: "#4a00e0", position: 100 }] },
    { name: "Fire & Ice", type: "radial", angle: 0, stops: [{ color: "#ff4e50", position: 0 }, { color: "#f9d423", position: 100 }] }
];

export default function CSSGradientTool() {
    const [type, setType] = useState("linear");
    const [angle, setAngle] = useState(135);
    const [stops, setStops] = useState([
        { color: "#667eea", position: 0 },
        { color: "#764ba2", position: 100 },
    ]);
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const gradient = useMemo(() => {
        const stopsStr = stops
            .sort((a, b) => a.position - b.position)
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ");
        if (type === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
        if (type === "radial") return `radial-gradient(circle, ${stopsStr})`;
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }, [type, angle, stops]);

    const cssCode = `background: ${gradient};`;
    const tailwindSnippet = `bg-gradient-to-r from-[${stops[0]?.color}] to-[${stops[stops.length - 1]?.color}]`;

    const addStop = () => {
        if (stops.length >= 8) return;
        // Place new stop in the middle of current range
        setStops([...stops, { color: "#3b82f6", position: 50 }]);
    };

    const removeStop = (index: number) => {
        if (stops.length <= 2) return;
        setStops(stops.filter((_, i) => i !== index));
    };

    const updateStop = (index: number, field: "color" | "position", value: any) => {
        const updated = [...stops];
        updated[index] = { ...updated[index], [field]: value };
        setStops(updated);
    };

    const copyToClipboard = async (text: string, formatId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(formatId);
            setTimeout(() => setCopiedFormat(null), 1500);
            toast.success(`Copied ${formatId.toUpperCase()} snippet.`);
        } catch (err) {
            console.error(err);
        }
    };

    const applyPreset = (preset: typeof GRADIENT_PRESETS[number]) => {
        setType(preset.type);
        setAngle(preset.angle);
        setStops(preset.stops);
        toast.success(`Preset "${preset.name}" applied.`);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Gradient generation runs locally inside browser RAM. No telemetry or data is shared.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Paintbrush className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">CSS Gradient Generator</h2>
                        <p className="text-xs text-muted-foreground">Design, mix, and preview linear, radial, and conic CSS gradients locally</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Preview & Presets Panel */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Live Preview */}
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm">
                        <div 
                            className="w-full h-56 rounded-2xl border border-border/25 shadow-inner transition-all duration-300"
                            style={{ background: gradient }}
                        />
                    </Card>

                    {/* Presets List */}
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Gradient Presets
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {GRADIENT_PRESETS.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => applyPreset(p)}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl border border-border/30 bg-background/50 hover:border-primary/45 transition-all text-left text-[11px] font-bold text-foreground"
                                >
                                    <div 
                                        className="w-full h-10 rounded-lg shadow-sm"
                                        style={{ 
                                            background: p.type === "linear" 
                                                ? `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.position}%`).join(", ")})` 
                                                : `radial-gradient(circle, ${p.stops.map(s => `${s.color} ${s.position}%`).join(", ")})`
                                        }}
                                    />
                                    <span className="truncate w-full text-center">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Editor Workspace Parameters */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Settings options */}
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-5 shadow-sm text-xs font-semibold">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                            <Settings className="w-3.5 h-3.5" /> Adjustments
                        </h4>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="type-select" className="text-[10px] text-muted-foreground uppercase">Gradient Type</Label>
                                <select
                                    id="type-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="linear">Linear</option>
                                    <option value="radial">Radial</option>
                                    <option value="conic">Conic</option>
                                </select>
                            </div>

                            {type !== "radial" && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="angle-slider" className="text-[10px] text-muted-foreground uppercase">Angle: {angle}°</Label>
                                    <input 
                                        id="angle-slider"
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={angle}
                                        onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            )}

                            <div className="space-y-3.5">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] text-muted-foreground uppercase">Color Stops</Label>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={addStop} 
                                        disabled={stops.length >= 8}
                                        className="h-7 text-[10px] font-bold text-primary hover:bg-muted"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Stop
                                    </Button>
                                </div>

                                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                                    {stops.map((stop, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={stop.color}
                                                onChange={(e) => updateStop(i, "color", e.target.value)}
                                                className="w-7 h-7 rounded border border-border/20 cursor-pointer shrink-0"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={stop.position}
                                                onChange={(e) => updateStop(i, "position", parseInt(e.target.value, 10))}
                                                className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">{stop.position}%</span>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeStop(i)}
                                                disabled={stops.length <= 2}
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
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
                                    className="font-mono text-[11px] h-12 bg-background/50 border-border/30 resize-none rounded-xl"
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
                                <Textarea 
                                    readOnly 
                                    value={tailwindSnippet} 
                                    className="font-mono text-[11px] h-12 bg-background/50 border-border/30 resize-none rounded-xl"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
