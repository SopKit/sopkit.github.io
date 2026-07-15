"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Plus,
    X,
    MoveUp,
    MoveDown,
    Image as ImageIcon,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

export default function ImageToPDF() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageSize, setPageSize] = useState<"A4" | "AUTO">("AUTO");
    const [orientation, setOrientation] = useState<"PORTRAIT" | "LANDSCAPE">("PORTRAIT");
    const [margin, setMargin] = useState<"NONE" | "SMALL" | "LARGE">("NONE");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(2, 9),
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prev => [...prev, ...newFiles]);
            setDownloadUrl(null);
            toast.success(`${newFiles.length} images added.`);
        }
        e.target.value = "";
    }, []);

    const removeImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            const removed = prev.find(img => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
        setDownloadUrl(null);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newImages = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newImages.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            setImages(newImages);
            setDownloadUrl(null);
        }
    };

    const generatePDF = async () => {
        if (images.length === 0) {
            toast.error("Please add at least one image.");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument, PageSizes } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.create();

            for (const imgFile of images) {
                let imgBytes = await imgFile.file.arrayBuffer();
                let isPng = imgFile.file.type === "image/png" || imgFile.file.name.toLowerCase().endsWith(".png");
                let isJpg = imgFile.file.type === "image/jpeg" || imgFile.file.name.toLowerCase().endsWith(".jpg") || imgFile.file.name.toLowerCase().endsWith(".jpeg");

                // If it is WebP, SVG, AVIF, or BMP, rasterize to JPEG first via canvas to keep pdf-lib happy
                if (!isPng && !isJpg) {
                    const imageEl = new Image();
                    imageEl.src = imgFile.preview;
                    await new Promise((resolve) => { imageEl.onload = resolve; });

                    const canvas = document.createElement("canvas");
                    canvas.width = imageEl.width;
                    canvas.height = imageEl.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(imageEl, 0, 0);

                    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
                    imgBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
                    isJpg = true;
                }

                // Embed the image
                let embeddedImage: any;
                if (isPng) {
                    embeddedImage = await pdfDoc.embedPng(imgBytes);
                } else {
                    embeddedImage = await pdfDoc.embedJpg(imgBytes);
                }

                const imgWidth = embeddedImage.width;
                const imgHeight = embeddedImage.height;

                // Determine page size
                let width = imgWidth;
                let height = imgHeight;

                if (pageSize === "A4") {
                    const a4Size = orientation === "PORTRAIT" ? PageSizes.A4 : [PageSizes.A4[1], PageSizes.A4[0]];
                    width = a4Size[0];
                    height = a4Size[1];
                }

                // Add page
                const page = pdfDoc.addPage([width, height]);

                // Calculate margins
                let marginSize = 0;
                if (margin === "SMALL") marginSize = 20;
                else if (margin === "LARGE") marginSize = 40;

                const contentWidth = width - marginSize * 2;
                const contentHeight = height - marginSize * 2;

                // Fit image into the page boundaries preserving aspect ratio
                const widthRatio = contentWidth / imgWidth;
                const heightRatio = contentHeight / imgHeight;
                const minRatio = Math.min(widthRatio, heightRatio, 1); // shrink only, don't stretch

                const drawWidth = imgWidth * minRatio;
                const drawHeight = imgHeight * minRatio;

                const x = marginSize + (contentWidth - drawWidth) / 2;
                const y = marginSize + (contentHeight - drawHeight) / 2;

                page.drawImage(embeddedImage, {
                    x,
                    y,
                    width: drawWidth,
                    height: drawHeight,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("PDF generated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF from images.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your images are converted to PDF locally in RAM. No file details are transmitted.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image to PDF Converter</h2>
                        <p className="text-xs text-muted-foreground">Convert JPG, PNG, WebP, SVG, and AVIF images into a single PDF document locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {images.length > 0 ? "Add More Images" : "Select Images"}
                    </Button>
                    <Button 
                        disabled={images.length === 0 || isProcessing}
                        onClick={generatePDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Generating...</>
                        ) : (
                            <><FileText className="mr-2 h-4 w-4" /> Convert to PDF</>
                        )}
                    </Button>
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {images.length === 0 ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Images to Convert</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload one or more image files. You can arrange their ordering and customize PDF margins.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Layout options bar */}
                            <Card className="p-5 border border-border/30 bg-card/10 rounded-2xl flex flex-wrap items-center gap-6 text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-primary shrink-0" />
                                    <span>Page Size:</span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => setPageSize(e.target.value as any)}
                                        className="h-8 px-2 rounded-lg border border-border/35 bg-background text-xs"
                                    >
                                        <option value="AUTO">Match Image Dimensions</option>
                                        <option value="A4">A4 Document</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Orientation:</span>
                                    <select
                                        value={orientation}
                                        disabled={pageSize === "AUTO"}
                                        onChange={(e) => setOrientation(e.target.value as any)}
                                        className="h-8 px-2 rounded-lg border border-border/35 bg-background text-xs disabled:opacity-40"
                                    >
                                        <option value="PORTRAIT">Portrait</option>
                                        <option value="LANDSCAPE">Landscape</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Margins:</span>
                                    <select
                                        value={margin}
                                        onChange={(e) => setMargin(e.target.value as any)}
                                        className="h-8 px-2 rounded-lg border border-border/35 bg-background text-xs"
                                    >
                                        <option value="NONE">No Margins</option>
                                        <option value="SMALL">Small Margins</option>
                                        <option value="LARGE">Large Margins</option>
                                    </select>
                                </div>
                            </Card>

                            {/* Images Reordering Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {images.map((img, index) => (
                                    <div
                                        key={img.id}
                                        className="group relative flex flex-col items-center p-3 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/20 hover:border-primary/20 transition-all duration-300"
                                    >
                                        {/* Action buttons */}
                                        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                disabled={index === 0}
                                                onClick={() => moveImage(index, 'up')}
                                                className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30"
                                            >
                                                <MoveUp className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={index === images.length - 1}
                                                onClick={() => moveImage(index, 'down')}
                                                className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30"
                                            >
                                                <MoveDown className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id)}
                                                className="w-5 h-5 rounded-full bg-destructive border border-destructive/20 text-white flex items-center justify-center hover:bg-destructive/90"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-border/10 bg-background shadow-inner flex items-center justify-center">
                                            <img
                                                src={img.preview}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        </div>
                                        <span className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Page {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Advanced embedding</h4>
                        <p className="text-muted-foreground">
                            WebP, SVG, AVIF, and standard JPEG/PNG uploads are processed natively. Margins ensure clean print outlines.
                        </p>
                    </Card>
                    
                    {downloadUrl && (
                        <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3 text-xs leading-relaxed animate-in">
                            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">PDF Ready!</h4>
                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                                <a href={downloadUrl} download="converted_images.pdf">
                                    <Download className="w-4 h-4 mr-2" /> Download PDF
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
