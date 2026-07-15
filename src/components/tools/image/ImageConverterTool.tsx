"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    ImageIcon, 
    Loader2, 
    ShieldCheck, 
    X,
    Settings,
    ArrowRight,
    Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ConverterFile {
    id: string;
    file: File;
    name: string;
    originalSize: number;
    preview: string;
    convertedBlob: Blob | null;
    convertedSize: number | null;
    status: "pending" | "processing" | "done" | "failed";
}

export default function ImageConverterTool({ defaultOutputFormat = "png" }) {
    const [files, setFiles] = useState<ConverterFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputFormat, setOutputFormat] = useState<string>(defaultOutputFormat);
    const [quality, setQuality] = useState<number>(90);
    const [widthInput, setWidthInput] = useState<string>("");
    const [heightInput, setHeightInput] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(2, 9),
                file,
                name: file.name,
                originalSize: file.size,
                preview: URL.createObjectURL(file),
                convertedBlob: null,
                convertedSize: null,
                status: "pending" as const
            }));
            setFiles(prev => [...prev, ...newFiles]);
            toast.success(`${newFiles.length} images added to converter queue.`);
        }
        e.target.value = "";
    }, []);

    const removeFile = (id: string) => {
        setFiles(prev => {
            const fileItem = prev.find(f => f.id === id);
            if (fileItem) URL.revokeObjectURL(fileItem.preview);
            return prev.filter(f => f.id !== id);
        });
    };

    const clearAll = () => {
        files.forEach(f => URL.revokeObjectURL(f.preview));
        setFiles([]);
    };

    const convertSingleImage = async (fileItem: ConverterFile): Promise<ConverterFile> => {
        const img = new Image();
        img.src = fileItem.preview;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context is missing");

        // Set dimensions (supporting optional resizing)
        const targetWidth = parseInt(widthInput, 10) || img.width;
        const targetHeight = parseInt(heightInput, 10) || img.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        let mimeType = "image/png";
        if (outputFormat === "jpeg" || outputFormat === "jpg") mimeType = "image/jpeg";
        else if (outputFormat === "webp") mimeType = "image/webp";

        const convertedBlob = await new Promise<Blob | null>((res) => {
            canvas.toBlob((b) => res(b), mimeType, quality / 100);
        });

        if (!convertedBlob) throw new Error("Format conversion failed");

        return {
            ...fileItem,
            convertedBlob,
            convertedSize: convertedBlob.size,
            status: "done"
        };
    };

    const runConversion = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProgress(0);

        const updatedFiles = [...files];
        
        for (let i = 0; i < updatedFiles.length; i++) {
            if (updatedFiles[i].status === "done") continue;
            updatedFiles[i].status = "processing";
            setFiles([...updatedFiles]);

            try {
                const result = await convertSingleImage(updatedFiles[i]);
                updatedFiles[i] = result;
            } catch (err) {
                console.error(err);
                updatedFiles[i].status = "failed";
            }
            
            setProgress(Math.round(((i + 1) / updatedFiles.length) * 100));
            setFiles([...updatedFiles]);
        }

        setIsProcessing(false);
        toast.success("All conversions finished!");
    };

    const downloadZip = async () => {
        const completed = files.filter(f => f.status === "done" && f.convertedBlob);
        if (completed.length === 0) return;

        setIsProcessing(true);
        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();

            completed.forEach((item) => {
                if (item.convertedBlob) {
                    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
                    const baseName = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
                    zip.file(`${baseName}_converted.${ext}`, item.convertedBlob);
                }
            });

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);

            const link = document.createElement("a");
            link.href = url;
            link.download = `converted_images_${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Successfully downloaded conversion ZIP archive!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to pack zip package.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Image conversion runs locally inside your browser memory context. No uploads or storage.</span>
            </div>

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image Converter</h2>
                        <p className="text-xs text-muted-foreground">Convert formats in bulk, resize dimensions, and download compiled packages locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Add Images
                    </Button>
                    {files.length > 0 && (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={clearAll}
                                className="border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold"
                            >
                                Clear All
                            </Button>
                            {files.some(f => f.status === "done") && (
                                <Button 
                                    onClick={downloadZip}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-500/10"
                                >
                                    <Download className="mr-2 h-4 w-4" /> Save ZIP
                                </Button>
                            )}
                            <Button 
                                disabled={isProcessing}
                                onClick={runConversion}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Converting...</>
                                ) : (
                                    <><Settings className="mr-2 h-4 w-4" /> Convert All</>
                                )}
                            </Button>
                        </>
                    )}
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

            {isProcessing && (
                <Card className="p-5 border border-border/30 bg-card/25 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span>Converting batch queue...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {files.length === 0 ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Images to Convert</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Choose one or more images. Configure output format parameters, scaling, and quality values.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {files.map((item) => {
                                return (
                                    <div 
                                        key={item.id} 
                                        className="flex flex-col sm:flex-row items-center justify-between p-4 border border-border/30 rounded-2xl bg-card/15 gap-4"
                                    >
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/10 bg-background flex-shrink-0">
                                                <img src={item.preview} className="w-full h-full object-cover" alt="preview" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate max-w-[200px] text-foreground">{item.name}</p>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <span className="text-[10px] text-muted-foreground">{formatFileSize(item.originalSize)}</span>
                                                    {item.status === "done" && item.convertedSize && (
                                                        <>
                                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                {formatFileSize(item.convertedSize)} ({outputFormat.toUpperCase()})
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                            {item.status === "pending" && (
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase">Pending</Badge>
                                            )}
                                            {item.status === "processing" && (
                                                <Loader2 className="w-4.5 h-4.5 text-primary animate-spin" />
                                            )}
                                            {item.status === "done" && (
                                                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[9px] font-bold uppercase">Converted</Badge>
                                            )}
                                            {item.status === "failed" && (
                                                <Badge variant="destructive" className="text-[9px] font-bold uppercase">Failed</Badge>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeFile(item.id)}
                                                className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Side Settings Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5" /> Output Settings
                        </h4>

                        <div className="space-y-4 text-xs font-semibold">
                            <div className="space-y-2">
                                <Label htmlFor="format-select" className="text-xs text-foreground">Target Format</Label>
                                <select
                                    id="format-select"
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-border/35 bg-background text-xs"
                                >
                                    <option value="png">PNG (Lossless)</option>
                                    <option value="jpeg">JPEG (Photo-Optimized)</option>
                                    <option value="webp">WebP (Modern Web)</option>
                                    <option value="bmp">BMP (Raw Bitmap)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quality-slider" className="text-xs text-foreground">Format Quality ({quality}%)</Label>
                                <input 
                                    id="quality-slider"
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={quality}
                                    disabled={outputFormat === "png" || outputFormat === "bmp"}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-40"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-1.5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="width-input" className="text-[10px] text-muted-foreground uppercase">Width (px)</Label>
                                    <Input 
                                        id="width-input"
                                        type="number"
                                        placeholder="Auto"
                                        value={widthInput}
                                        onChange={(e) => setWidthInput(e.target.value)}
                                        className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="height-input" className="text-[10px] text-muted-foreground uppercase">Height (px)</Label>
                                    <Input 
                                        id="height-input"
                                        type="number"
                                        placeholder="Auto"
                                        value={heightInput}
                                        onChange={(e) => setHeightInput(e.target.value)}
                                        className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <Grid className="w-4 h-4 text-primary" /> Multi-file ZIP
                        </h4>
                        <p className="text-muted-foreground">
                            When converting multiple items, you can save them as a single compiled ZIP archive with one tap.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
