"use client";

import { useState, useEffect, useRef } from "react";
import { 
    Download, 
    Image as ImageIcon, 
    Smile, 
    Type, 
    Upload,
    ShieldCheck,
    Settings,
    Grid,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FaviconGeneratorTool() {
    const [mode, setMode] = useState<"text" | "emoji" | "image">("text");
    const [text, setText] = useState("S");
    const [emoji, setEmoji] = useState("🚀");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [textColor, setTextColor] = useState("#FFFFFF");
    const [backgroundColor, setBackgroundColor] = useState("#2563EB");
    const [borderRadius, setBorderRadius] = useState<number>(16); // percentage
    const [fontSize, setFontSize] = useState<number>(65); // percentage
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            setMode("image");
            toast.success("Image uploaded. Custom rounded borders can now be applied.");
        }
        e.target.value = "";
    };

    const drawFaviconOnCanvas = (canvas: HTMLCanvasElement, renderSize: number) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = renderSize;
        canvas.height = renderSize;
        ctx.clearRect(0, 0, renderSize, renderSize);

        const radius = (borderRadius / 100) * renderSize;

        // Background (only for text & emoji, or for image if desired)
        if (mode !== "image" || !uploadedImage) {
            ctx.fillStyle = backgroundColor;
            ctx.beginPath();
            ctx.roundRect(0, 0, renderSize, renderSize, radius);
            ctx.fill();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (mode === "text") {
            ctx.fillStyle = textColor;
            ctx.font = `bold ${(fontSize / 100) * renderSize}px sans-serif`;
            ctx.fillText(text.substring(0, 2), renderSize / 2, renderSize / 2);
        } else if (mode === "emoji") {
            ctx.font = `${(fontSize / 100) * renderSize * 0.9}px serif`;
            // Adjust emoji baseline slightly
            ctx.fillText(emoji, renderSize / 2, renderSize / 2 + renderSize * 0.05);
        } else if (mode === "image" && uploadedImage) {
            const img = new Image();
            img.src = uploadedImage;
            // Draw synchronously if already cached, otherwise we assume loaded in preview
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, 0, renderSize, renderSize, radius);
            ctx.clip();
            ctx.drawImage(img, 0, 0, renderSize, renderSize);
            ctx.restore();
        }
    };

    const updatePreview = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        if (mode === "image" && uploadedImage) {
            const img = new Image();
            img.onload = () => {
                drawFaviconOnCanvas(canvas, 128);
                setPreviewUrl(canvas.toDataURL("image/png"));
            };
            img.src = uploadedImage;
        } else {
            drawFaviconOnCanvas(canvas, 128);
            setPreviewUrl(canvas.toDataURL("image/png"));
        }
    };

    useEffect(() => {
        updatePreview();
    }, [mode, text, emoji, uploadedImage, textColor, backgroundColor, borderRadius, fontSize]);

    const generateFaviconPackage = async () => {
        setIsExporting(true);
        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();

            const tempCanvas = document.createElement("canvas");
            
            // Sizes required for modern webapps
            const sizes = [
                { name: "favicon-16x16.png", size: 16 },
                { name: "favicon-32x32.png", size: 32 },
                { name: "apple-touch-icon.png", size: 180 },
                { name: "android-chrome-192x192.png", size: 192 },
                { name: "android-chrome-512x512.png", size: 512 },
            ];

            // Wait briefly for image renders
            if (mode === "image" && uploadedImage) {
                const img = new Image();
                img.src = uploadedImage;
                await new Promise((resolve) => { img.onload = resolve; });
            }

            for (const item of sizes) {
                drawFaviconOnCanvas(tempCanvas, item.size);
                const dataUrl = tempCanvas.toDataURL("image/png");
                const base64Data = dataUrl.split(",")[1];
                zip.file(item.name, base64Data, { base64: true });
            }

            // Generate raw favicon.ico (fallback 32x32 size)
            drawFaviconOnCanvas(tempCanvas, 32);
            const icoDataUrl = tempCanvas.toDataURL("image/png");
            zip.file("favicon.ico", icoDataUrl.split(",")[1], { base64: true });

            // Generate webmanifest JSON
            const manifest = {
                name: "My Web App",
                short_name: "App",
                icons: [
                    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
                ],
                theme_color: backgroundColor,
                background_color: backgroundColor,
                display: "standalone"
            };
            zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

            // Generate HTML integration snippet helper
            const htmlSnippet = `<!-- Favicon configuration -->\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="manifest" href="/site.webmanifest">`;
            zip.file("readme-html.txt", htmlSnippet);

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);

            const link = document.createElement("a");
            link.href = url;
            link.download = "favicons_package.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Successfully generated and downloaded Favicon Zip package!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate Favicon package.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Favicon generation runs locally in your browser. No files are uploaded to any server.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Favicon Package Generator</h2>
                        <p className="text-xs text-muted-foreground">Create text, emoji, or image favicons and compile a ready-to-use HTML asset package locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        disabled={isExporting}
                        onClick={generateFaviconPackage}
                        className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10 animate-in"
                    >
                        {isExporting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Packing...</>
                        ) : (
                            <><Download className="mr-2 h-4 w-4" /> Download Favicon Package</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Configuration controls */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/10 rounded-3xl space-y-6 shadow-sm">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5" /> Configurations
                        </h3>

                        {/* Mode selectors */}
                        <div className="flex gap-2 p-1 bg-muted/20 border border-border/20 rounded-lg">
                            {[
                                { id: "text", label: "Text", icon: Type },
                                { id: "emoji", label: "Emoji", icon: Smile },
                                { id: "image", label: "Image", icon: ImageIcon }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setMode(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center h-8 rounded-md text-xs font-bold gap-1 transition-all ${mode === tab.id ? "bg-card text-foreground border border-border/20 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {mode === "text" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="text-input" className="text-xs font-bold text-foreground">Letters (Max 2)</Label>
                                        <Input 
                                            id="text-input"
                                            value={text}
                                            maxLength={2}
                                            onChange={(e) => setText(e.target.value)}
                                            className="h-10 border-border/30 bg-background/50 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="text-color" className="text-xs font-bold text-foreground">Text Color</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id="text-color"
                                                type="color"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="w-12 h-10 p-1 border-border/30 bg-transparent rounded-lg shrink-0 cursor-pointer"
                                            />
                                            <Input 
                                                type="text"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="h-10 border-border/30 bg-background/50 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mode === "emoji" && (
                                <div className="space-y-2">
                                    <Label htmlFor="emoji-input" className="text-xs font-bold text-foreground">Select Emoji</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            id="emoji-input"
                                            value={emoji}
                                            onChange={(e) => setEmoji(e.target.value)}
                                            className="h-10 border-border/30 bg-background/50 text-sm"
                                        />
                                        <div className="flex gap-2 overflow-x-auto py-1">
                                            {["🚀", "🔥", "⚡", "💻", "🎨", "📦", "🔒", "📈"].map(e => (
                                                <button
                                                    key={e}
                                                    type="button"
                                                    onClick={() => setEmoji(e)}
                                                    className="w-8 h-8 rounded-lg bg-muted/40 hover:bg-muted border border-border/20 text-sm shrink-0"
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mode === "image" && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-foreground">Upload Image</Label>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 border-border text-xs font-bold"
                                        >
                                            Select PNG / JPG / SVG
                                        </Button>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Global style parameters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {mode !== "image" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="bg-color" className="text-xs font-bold text-foreground">Background Color</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id="bg-color"
                                                type="color"
                                                value={backgroundColor}
                                                onChange={(e) => setBackgroundColor(e.target.value)}
                                                className="w-12 h-10 p-1 border-border/30 bg-transparent rounded-lg shrink-0 cursor-pointer"
                                            />
                                            <Input 
                                                type="text"
                                                value={backgroundColor}
                                                onChange={(e) => setBackgroundColor(e.target.value)}
                                                className="h-10 border-border/30 bg-background/50 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="radius-input" className="text-xs font-bold text-foreground">Rounded Corners ({borderRadius}%)</Label>
                                    <input 
                                        id="radius-input"
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={borderRadius}
                                        onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                {mode !== "image" && (
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label htmlFor="font-scale" className="text-xs font-bold text-foreground">Content Scale ({fontSize}%)</Label>
                                        <input 
                                            id="font-scale"
                                            type="range"
                                            min="30"
                                            max="90"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Preview viewport */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-6 text-center shadow-sm">
                        <h3 className="font-bold text-sm text-foreground flex items-center justify-center gap-1.5">
                            <Grid className="w-4 h-4 text-primary" /> Favicon Preview
                        </h3>

                        <div className="flex flex-col items-center gap-6 justify-center">
                            {previewUrl ? (
                                <div className="p-8 border border-border/20 bg-background/40 rounded-3xl flex items-center justify-center shadow-inner">
                                    <img 
                                        src={previewUrl} 
                                        alt="Favicon preview" 
                                        className="w-24 h-24 object-contain" 
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-3xl bg-muted/20 animate-pulse border border-border/10" />
                            )}

                            <div className="space-y-2.5 w-full">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Browser Tab Simulation</h4>
                                <div className="p-2.5 border border-border/20 bg-background rounded-xl flex items-center gap-2 max-w-xs mx-auto text-left shadow-sm">
                                    {previewUrl && (
                                        <img 
                                            src={previewUrl} 
                                            alt="Icon" 
                                            className="w-4 h-4 rounded-sm object-contain" 
                                        />
                                    )}
                                    <span className="text-[10px] font-bold truncate text-foreground flex-1">My Premium Website</span>
                                    <span className="text-muted-foreground text-[8px] font-bold shrink-0">✕</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
    );
}
