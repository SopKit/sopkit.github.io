"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
    Upload, 
    Copy, 
    ImageIcon,
    History,
    Check,
    Pipette,
    ShieldCheck,
    Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ImageColorPicker() {
    const [image, setImage] = useState<string | null>(null);
    const [pickedColor, setPickedColor] = useState<string>("#0F172A");
    const [rgb, setRgb] = useState<{r: number, g: number, b: number}>({r: 15, g: 23, b: 42});
    const [history, setHistory] = useState<string[]>(["#0F172A", "#3B82F6", "#10B981", "#EF4444"]);
    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setHistory([]);
            };
            reader.readAsDataURL(file);
            toast.success("Image loaded. Hover over the image to inspect colors.");
        } else if (file) {
            toast.error("Please select a valid image file");
        }
        e.target.value = "";
    }, []);

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const rgbToCmyk = (r: number, g: number, b: number) => {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) {
            return `cmyk(0%, 0%, 0%, 100%)`;
        }

        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
        k = k * 100;

        return `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current || !canvasRef.current) return;
        
        const rect = imageRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        // Calculate original coordinate layout (mapping scaling variables)
        const scaleX = imageRef.current.naturalWidth / rect.width;
        const scaleY = imageRef.current.naturalHeight / rect.height;
        const origX = Math.floor(x * scaleX);
        const origY = Math.floor(y * scaleY);

        setMousePos({ x, y });
        setZoomPos({ x: origX, y: origY });

        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
        if (ctx) {
            try {
                const pixel = ctx.getImageData(origX, origY, 1, 1).data;
                const r = pixel[0];
                const g = pixel[1];
                const b = pixel[2];
                setRgb({ r, g, b });
                setPickedColor(rgbToHex(r, g, b));
            } catch (err) {
                // Cross origin canvas fallback
            }
        }
    };

    const handlePickColor = () => {
        if (pickedColor) {
            setHistory(prev => [pickedColor, ...prev.filter(c => c !== pickedColor)].slice(0, 10));
            navigator.clipboard.writeText(pickedColor);
            toast.success(`Copied HEX code: ${pickedColor}`);
        }
    };

    const copyFormatText = (text: string, formatId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(formatId);
        setTimeout(() => setCopiedFormat(null), 1500);
        toast.success(`Copied ${formatId.toUpperCase()} value: ${text}`);
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current!;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                }
            };
            img.src = image;
        }
    }, [image]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Image sampling and color calculations run locally in memory. No uploads.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Pipette className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image Color Picker</h2>
                        <p className="text-xs text-muted-foreground">Pick exact Hex, RGB, HSL, and CMYK color codes from images locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {image ? "Change Image" : "Select Image"}
                    </Button>
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Image Canvas View */}
                <div className="lg:col-span-3 space-y-6">
                    {!image ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Pipette className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Image to Pick Colors</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a design draft, logo, or image. Hover and click anywhere on the viewport to grab precise color values.
                            </p>
                        </div>
                    ) : (
                        <Card className="border border-border/40 bg-white overflow-hidden shadow-lg rounded-3xl">
                            <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-foreground">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Hover & Click to Capture</span>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Zoom Loupe Active</Badge>
                            </div>
                            <div className="p-8 flex items-center justify-center bg-muted/5 relative overflow-hidden select-none">
                                <div 
                                    className="relative cursor-crosshair max-w-full"
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                    onClick={handlePickColor}
                                >
                                    <img 
                                        ref={imageRef}
                                        src={image} 
                                        alt="Color Picker Board" 
                                        className="max-h-[400px] object-contain rounded-xl border pointer-events-none" 
                                    />
                                    
                                    {/* Magnifying Loupe Circular Overlay */}
                                    {isHovering && (
                                        <div 
                                            style={{
                                                position: "absolute",
                                                left: `${mousePos.x}px`,
                                                top: `${mousePos.y}px`,
                                                transform: "translate(-50%, -50%)",
                                                pointerEvents: "none",
                                                border: `4px solid ${pickedColor}`,
                                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3), inset 0 0 8px rgba(0,0,0,0.2)"
                                            }}
                                            className="w-16 h-16 rounded-full overflow-hidden z-30 bg-white flex items-center justify-center"
                                        >
                                            {/* Micro zoom background render using raw canvas scale mapping */}
                                            <div 
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    backgroundColor: pickedColor
                                                }}
                                                className="flex items-center justify-center"
                                            >
                                                <span className="text-[8px] text-white font-mono drop-shadow bg-black/40 px-1 rounded">
                                                    {pickedColor}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Side Info & Values Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-6">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <Palette className="w-4 h-4 text-primary" /> Color Inspector
                        </h3>

                        <div className="space-y-4">
                            {/* Color Preview Block */}
                            <div className="flex gap-4 items-center">
                                <div 
                                    style={{ backgroundColor: pickedColor }}
                                    className="w-16 h-16 rounded-2xl border border-border/40 shadow-inner shrink-0" 
                                />
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Capture</h4>
                                    <p className="text-lg font-black text-foreground font-mono mt-0.5">{pickedColor}</p>
                                </div>
                            </div>

                            {/* Color Formats Inputs */}
                            <div className="space-y-3.5 pt-2">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-muted-foreground uppercase">HEX Code</Label>
                                    <div className="relative">
                                        <Input readOnly value={pickedColor} className="font-mono text-xs h-9 bg-background/40 pr-10" />
                                        <button 
                                            onClick={() => copyFormatText(pickedColor, "hex")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                                        >
                                            {copiedFormat === "hex" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-muted-foreground uppercase">RGB Value</Label>
                                    <div className="relative">
                                        <Input readOnly value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} className="font-mono text-xs h-9 bg-background/40 pr-10" />
                                        <button 
                                            onClick={() => copyFormatText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                                        >
                                            {copiedFormat === "rgb" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-muted-foreground uppercase">HSL Format</Label>
                                    <div className="relative">
                                        <Input readOnly value={rgbToHsl(rgb.r, rgb.g, rgb.b)} className="font-mono text-xs h-9 bg-background/40 pr-10" />
                                        <button 
                                            onClick={() => copyFormatText(rgbToHsl(rgb.r, rgb.g, rgb.b), "hsl")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                                        >
                                            {copiedFormat === "hsl" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-muted-foreground uppercase">CMYK (Print)</Label>
                                    <div className="relative">
                                        <Input readOnly value={rgbToCmyk(rgb.r, rgb.g, rgb.b)} className="font-mono text-xs h-9 bg-background/40 pr-10" />
                                        <button 
                                            onClick={() => copyFormatText(rgbToCmyk(rgb.r, rgb.g, rgb.b), "cmyk")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                                        >
                                            {copiedFormat === "cmyk" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* History Panel */}
                    {history.length > 0 && (
                        <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <History className="w-3.5 h-3.5" /> Recent Color Swatches
                            </h3>
                            <div className="grid grid-cols-5 gap-3">
                                {history.map((color, i) => (
                                    <button
                                        key={`${color}-${i}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setPickedColor(color);
                                            // Parse hex back to RGB to update sliders
                                            const r = parseInt(color.slice(1, 3), 16) || 0;
                                            const g = parseInt(color.slice(3, 5), 16) || 0;
                                            const b = parseInt(color.slice(5, 7), 16) || 0;
                                            setRgb({ r, g, b });
                                            navigator.clipboard.writeText(color);
                                            toast.success(`HEX code loaded and copied: ${color}`);
                                        }}
                                        className="aspect-square w-full rounded-xl border border-border/20 shadow-sm hover:scale-105 active:scale-95 transition-all"
                                        title={color}
                                    />
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
