"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    Image as ImageIcon,
    Loader2,
    ShieldCheck,
    Settings,
    Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FaviconSize {
    size: number;
    name: string;
    checked: boolean;
    desc: string;
}

export default function FaviconGeneratorProTool() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [sizes, setSizes] = useState<FaviconSize[]>([
        { size: 16, name: "favicon-16x16.png", checked: true, desc: "Legacy browser tabs" },
        { size: 32, name: "favicon-32x32.png", checked: true, desc: "Standard browser tabs" },
        { size: 48, name: "favicon-48x48.png", checked: true, desc: "Windows desktop shortcut" },
        { size: 180, name: "apple-touch-icon.png", checked: true, desc: "iOS home screen" },
        { size: 192, name: "android-chrome-192x192.png", checked: true, desc: "Android home screen" },
        { size: 512, name: "android-chrome-512x512.png", checked: true, desc: "PWA splash screen" }
    ]);

    const [includeIco, setIncludeIco] = useState(true);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target?.result as string);
            toast.success("Image uploaded. Select sizes and download your package.");
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
        e.target.value = "";
    }, []);

    const toggleSize = (index: number) => {
        setSizes(prev =>
            prev.map((s, idx) => idx === index ? { ...s, checked: !s.checked } : s)
        );
    };

    const generateFavicons = async () => {
        if (!imageSrc) return;
        setIsGenerating(true);

        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();
            const img = new Image();

            img.src = imageSrc;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context is missing");

            // Generate selected PNG sizes
            const selectedSizes = sizes.filter(s => s.checked);
            for (const sizeObj of selectedSizes) {
                canvas.width = sizeObj.size;
                canvas.height = sizeObj.size;
                ctx.clearRect(0, 0, sizeObj.size, sizeObj.size);
                ctx.drawImage(img, 0, 0, sizeObj.size, sizeObj.size);

                const dataUrl = canvas.toDataURL("image/png");
                const base64Data = dataUrl.split(",")[1];
                zip.file(sizeObj.name, base64Data, { base64: true });
            }

            // Generate standard favicon.ico
            if (includeIco) {
                canvas.width = 32;
                canvas.height = 32;
                ctx.clearRect(0, 0, 32, 32);
                ctx.drawImage(img, 0, 0, 32, 32);
                const icoDataUrl = canvas.toDataURL("image/png");
                zip.file("favicon.ico", icoDataUrl.split(",")[1], { base64: true });
            }

            // Webmanifest configuration file
            const manifest = {
                name: "My App",
                short_name: "App",
                icons: [
                    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
                ],
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone"
            };
            zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

            // Generate HTML readme tags helper
            const htmlTags = `<!-- Favicon configuration -->\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="manifest" href="/site.webmanifest">`;
            zip.file("readme-html-tags.txt", htmlTags);

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);

            const link = document.createElement("a");
            link.href = url;
            link.download = `favicons_package_${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Favicon package generated and downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate favicon files.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Image resizing and packaging happens entirely in local memory. No files are uploaded.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Favicon Package Generator (Pro)</h2>
                        <p className="text-xs text-muted-foreground">Upload your high-res logo and export standard multiresolution web favicons locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {imageSrc ? "Change Image" : "Select Image"}
                    </Button>
                    {imageSrc && (
                        <Button 
                            disabled={isGenerating}
                            onClick={generateFavicons}
                            className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                        >
                            {isGenerating ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Packing...</>
                            ) : (
                                <><Download className="mr-2 h-4 w-4" /> Export Favicons ZIP</>
                            )}
                        </Button>
                    )}
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
                {/* File picker & sizes list */}
                <div className="lg:col-span-3 space-y-6">
                    {!imageSrc ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Logo to Generate</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a transparent PNG or SVG logo to split and package standard sizes for modern web deployments.
                            </p>
                        </div>
                    ) : (
                        <Card className="p-6 border border-border/40 bg-card/10 rounded-3xl space-y-6 shadow-sm animate-in">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5" /> Target Sizes
                            </h3>

                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between p-3 border border-border/20 rounded-xl bg-background/50">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="ico-toggle" className="text-xs font-bold text-foreground cursor-pointer">Generate favicon.ico</Label>
                                        <p className="text-[10px] text-muted-foreground leading-normal">
                                            32x32 pixel fallback container for legacy desktop browsers.
                                        </p>
                                    </div>
                                    <Switch 
                                        id="ico-toggle" 
                                        checked={includeIco} 
                                        onCheckedChange={setIncludeIco}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {sizes.map((s, idx) => (
                                    <div key={s.name} className="flex items-center justify-between p-3 border border-border/20 rounded-xl bg-background/50">
                                        <div className="space-y-0.5">
                                            <Label htmlFor={`size-${idx}`} className="text-xs font-bold text-foreground cursor-pointer">
                                                {s.name} ({s.size}x{s.size})
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground leading-normal">{s.desc}</p>
                                        </div>
                                        <Switch 
                                            id={`size-${idx}`} 
                                            checked={s.checked} 
                                            onCheckedChange={() => toggleSize(idx)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Upload Image Preview Box */}
                {imageSrc && (
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl text-center shadow-sm">
                            <h3 className="font-bold text-sm text-foreground flex items-center justify-center gap-1.5">
                                <Grid className="w-4 h-4 text-primary" /> Source Preview
                            </h3>
                            <div className="p-8 border border-border/20 bg-background/40 rounded-3xl flex items-center justify-center shadow-inner mt-4">
                                <img 
                                    src={imageSrc} 
                                    alt="Uploaded logo preview" 
                                    className="max-h-[180px] object-contain rounded-lg" 
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 truncate font-bold font-mono">{fileName}</p>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
