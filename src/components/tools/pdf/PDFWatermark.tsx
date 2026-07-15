"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Layers,
    Type,
    Image as ImageIcon,
    Settings,
    Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PDFWatermark() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [wmType, setWmType] = useState<"text" | "image">("text");
    const [text, setText] = useState("CONFIDENTIAL");
    const [image, setImage] = useState<string | null>(null);
    const [opacity, setOpacity] = useState<number>(0.3);
    const [rotation, setRotation] = useState<number>(45);
    const [fontSize, setFontSize] = useState<number>(50);
    const [layoutMode, setLayoutMode] = useState<"center" | "tile">("center");
    const [textColor, setTextColor] = useState<string>("gray");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wmImageInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setDownloadUrl(null);
            toast.success("PDF loaded successfully");
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const onWmImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setDownloadUrl(null);
                toast.success("Watermark image uploaded");
            };
            reader.readAsDataURL(selectedFile);
        }
        e.target.value = "";
    }, []);

    const addWatermark = async () => {
        if (!file) return;
        if (wmType === "image" && !image) {
            toast.error("Please select a watermark image first.");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            
            let wmImage: any = null;
            if (wmType === "image" && image) {
                const imageBytes = await fetch(image).then(res => res.arrayBuffer());
                if (image.includes("image/png")) {
                    wmImage = await pdfDoc.embedPng(imageBytes);
                } else {
                    wmImage = await pdfDoc.embedJpg(imageBytes);
                }
            }

            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Determine RGB color
            let colorVal = rgb(0.5, 0.5, 0.5); // default gray
            if (textColor === "black") colorVal = rgb(0, 0, 0);
            else if (textColor === "red") colorVal = rgb(0.85, 0.18, 0.18);
            else if (textColor === "blue") colorVal = rgb(0.18, 0.35, 0.85);

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                if (wmType === "text") {
                    const textWidth = font.widthOfTextAtSize(text, fontSize);
                    
                    if (layoutMode === "center") {
                        // Draw single rotated text centered
                        page.drawText(text, {
                            x: width / 2 - textWidth / 2 + (textWidth / 4) * Math.sin(rotation * Math.PI / 180),
                            y: height / 2 - fontSize / 2,
                            size: fontSize,
                            font: font,
                            color: colorVal,
                            opacity: opacity,
                            rotate: degrees(rotation),
                        });
                    } else {
                        // Tiled layout (grid pattern)
                        const stepX = 180;
                        const stepY = 180;
                        for (let x = 50; x < width; x += stepX) {
                            for (let y = 50; y < height; y += stepY) {
                                page.drawText(text, {
                                    x,
                                    y,
                                    size: fontSize * 0.5,
                                    font: font,
                                    color: colorVal,
                                    opacity: opacity * 0.7,
                                    rotate: degrees(rotation),
                                });
                            }
                        }
                    }
                } else if (wmImage) {
                    const aspect = wmImage.width / wmImage.height;
                    const targetWidth = fontSize * 3; // Use font size as base scale
                    const targetHeight = targetWidth / aspect;

                    if (layoutMode === "center") {
                        page.drawImage(wmImage, {
                            x: width / 2 - targetWidth / 2,
                            y: height / 2 - targetHeight / 2,
                            width: targetWidth,
                            height: targetHeight,
                            opacity: opacity,
                            rotate: degrees(rotation),
                        });
                    } else {
                        // Tiled layout for images
                        const stepX = 200;
                        const stepY = 200;
                        for (let x = 60; x < width; x += stepX) {
                            for (let y = 60; y < height; y += stepY) {
                                page.drawImage(wmImage, {
                                    x,
                                    y,
                                    width: targetWidth * 0.6,
                                    height: targetHeight * 0.6,
                                    opacity: opacity * 0.6,
                                    rotate: degrees(rotation),
                                });
                            }
                        }
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("Watermark added successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add watermark to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are watermarked locally in memory. No uploads.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Watermark Adder</h2>
                        <p className="text-xs text-muted-foreground">Add text or image watermarks to protect your PDF files locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change PDF" : "Select PDF"}
                    </Button>
                    <Button 
                        disabled={!file || isProcessing}
                        onClick={addWatermark}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Watermarking...</>
                        ) : (
                            <><Layers className="mr-2 h-4 w-4" /> Add Watermark</>
                        )}
                    </Button>
                </div>
                <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Layers className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload PDF to Watermark</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a PDF document to apply custom security overlays or business logos locally.
                            </p>
                        </div>
                    ) : (
                        <Card className="border-border/40 bg-card/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg animate-in">
                            <div className="p-8 flex flex-col items-center justify-center bg-muted/20 border-b border-border/20">
                                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                                    <FileText className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-base font-bold truncate max-w-xs">{file.name}</h3>
                                <div className="mt-3 flex gap-2">
                                    <Badge variant="secondary" className="text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs">Ready to Overlay</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                            <Settings className="w-3.5 h-3.5" />
                                            Watermark Configurations
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            <div className="flex gap-2 p-1 bg-muted/20 border border-border/20 rounded-lg">
                                                <Button 
                                                    type="button" 
                                                    variant={wmType === "text" ? "secondary" : "ghost"}
                                                    onClick={() => setWmType("text")}
                                                    className="flex-1 text-xs font-bold h-8"
                                                >
                                                    <Type className="w-3.5 h-3.5 mr-1" /> Text
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant={wmType === "image" ? "secondary" : "ghost"}
                                                    onClick={() => setWmType("image")}
                                                    className="flex-1 text-xs font-bold h-8"
                                                >
                                                    <ImageIcon className="w-3.5 h-3.5 mr-1" /> Image
                                                </Button>
                                            </div>

                                            {wmType === "text" ? (
                                                <div className="space-y-2">
                                                    <Label htmlFor="wm-text" className="text-xs font-semibold text-foreground">Watermark Text</Label>
                                                    <Input 
                                                        id="wm-text"
                                                        type="text"
                                                        value={text}
                                                        onChange={(e) => setText(e.target.value)}
                                                        className="border-border/30 bg-background/50 h-10 text-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-foreground">Watermark Image</Label>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={() => wmImageInputRef.current?.click()}
                                                            className="flex-1 border-border/50 text-xs font-bold"
                                                        >
                                                            Select PNG / JPG
                                                        </Button>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            ref={wmImageInputRef}
                                                            onChange={onWmImageChange}
                                                        />
                                                    </div>
                                                    {image && (
                                                        <div className="p-2 border border-border/20 rounded-lg bg-background/40 flex items-center justify-center">
                                                            <img src={image} className="max-h-20 object-contain" alt="Watermark preview" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="layout-select" className="text-xs font-semibold text-foreground">Layout Pattern</Label>
                                                <select
                                                    id="layout-select"
                                                    value={layoutMode}
                                                    onChange={(e) => setLayoutMode(e.target.value as any)}
                                                    className="w-full h-10 px-3 rounded-lg border border-border/35 bg-background text-sm focus-visible:ring-primary/20"
                                                >
                                                    <option value="center">Single Centered</option>
                                                    <option value="tile">Repeated Grid (Tiled)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                            <Grid className="w-3.5 h-3.5" />
                                            Style & Dimensions
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="color-select" className="text-xs font-semibold text-foreground">Color (Text Only)</Label>
                                                    <select
                                                        id="color-select"
                                                        value={textColor}
                                                        disabled={wmType === "image"}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="w-full h-10 px-3 rounded-lg border border-border/35 bg-background text-sm focus-visible:ring-primary/20"
                                                    >
                                                        <option value="gray">Gray</option>
                                                        <option value="black">Black</option>
                                                        <option value="red">Red</option>
                                                        <option value="blue">Blue</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="size-input" className="text-xs font-semibold text-foreground">Size / Scale</Label>
                                                    <Input 
                                                        id="size-input"
                                                        type="number"
                                                        min="10"
                                                        max="200"
                                                        value={fontSize}
                                                        onChange={(e) => setFontSize(Math.max(10, Math.min(200, parseInt(e.target.value, 10) || 50)))}
                                                        className="border-border/30 bg-background/50 h-10 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="rotation-input" className="text-xs font-semibold text-foreground">Rotation (deg)</Label>
                                                    <Input 
                                                        id="rotation-input"
                                                        type="number"
                                                        value={rotation}
                                                        onChange={(e) => setRotation(parseInt(e.target.value, 10) || 0)}
                                                        className="border-border/30 bg-background/50 h-10 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="opacity-input" className="text-xs font-semibold text-foreground">Opacity (0 - 1)</Label>
                                                    <Input 
                                                        id="opacity-input"
                                                        type="number"
                                                        step="0.05"
                                                        min="0.05"
                                                        max="1"
                                                        value={opacity}
                                                        onChange={(e) => setOpacity(Math.max(0.05, Math.min(1, parseFloat(e.target.value) || 0.3)))}
                                                        className="border-border/30 bg-background/50 h-10 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {downloadUrl && (
                                    <div className="pt-6 border-t border-border/20 text-center animate-in">
                                        <Button asChild className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10">
                                            <a href={downloadUrl} download={`${file.name.replace(/\.pdf$/i, "")}_watermarked.pdf`}>
                                                <Download className="w-4 h-4 mr-2" /> Download Watermarked PDF
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Protection layouts</h4>
                        <p className="text-muted-foreground">
                            Use the <strong>Repeated Grid</strong> layout to fill the entire document. This prevents unauthorized cropping or copying of specific sections.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
