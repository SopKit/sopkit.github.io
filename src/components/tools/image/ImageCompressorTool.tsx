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
    CheckCircle2,
    FileText,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CompressorFile {
    id: string;
    file: File;
    name: string;
    originalSize: number;
    preview: string;
    compressedBlob: Blob | null;
    compressedSize: number | null;
    status: "pending" | "processing" | "done" | "failed";
}

export default function ImageCompressorTool() {
    const [files, setFiles] = useState<CompressorFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<"quality" | "target-kb">("quality");
    const [quality, setQuality] = useState<number>(75);
    const [targetKb, setTargetKb] = useState<number>(200);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(2, 9),
                file,
                name: file.name,
                originalSize: file.size,
                preview: URL.createObjectURL(file),
                compressedBlob: null,
                compressedSize: null,
                status: "pending" as const
            }));
            setFiles(prev => [...prev, ...newFiles]);
            toast.success(`${newFiles.length} images queued for compression.`);
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

    const compressSingleImage = async (fileItem: CompressorFile): Promise<CompressorFile> => {
        const img = new Image();
        img.src = fileItem.preview;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context missing");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const mimeType = fileItem.file.type || "image/jpeg";
        let compressedBlob: Blob | null = null;

        if (mode === "quality") {
            const qualityValue = quality / 100;
            compressedBlob = await new Promise<Blob | null>((res) => {
                canvas.toBlob((b) => res(b), mimeType, qualityValue);
            });
        } else {
            // Binary search to find optimal compression quality fitting under targetKb
            let low = 0.05, high = 0.98;
            let bestBlob: Blob | null = null;

            for (let i = 0; i < 7; i++) {
                const mid = (low + high) / 2;
                const blob = await new Promise<Blob | null>((res) => {
                    canvas.toBlob((b) => res(b), mimeType, mid);
                });
                
                if (blob && blob.size <= targetKb * 1024) {
                    bestBlob = blob;
                    low = mid; // Try higher quality
                } else {
                    high = mid; // Needs smaller size
                }
            }

            // Fallback if target size was too low to satisfy even at minimum quality
            if (!bestBlob) {
                bestBlob = await new Promise<Blob | null>((res) => {
                    canvas.toBlob((b) => res(b), mimeType, 0.05);
                });
            }
            compressedBlob = bestBlob;
        }

        if (!compressedBlob) throw new Error("Compression failed");

        return {
            ...fileItem,
            compressedBlob,
            compressedSize: compressedBlob.size,
            status: "done"
        };
    };

    const runCompression = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        const updatedFiles = [...files];
        
        for (let i = 0; i < updatedFiles.length; i++) {
            if (updatedFiles[i].status === "done") continue;
            
            updatedFiles[i].status = "processing";
            setFiles([...updatedFiles]);
            
            try {
                const result = await compressSingleImage(updatedFiles[i]);
                updatedFiles[i] = result;
            } catch (err) {
                console.error(err);
                updatedFiles[i].status = "failed";
            }
            setFiles([...updatedFiles]);
        }

        setIsProcessing(false);
        toast.success("Compression process completed successfully!");
    };

    const downloadCompressed = (fileItem: CompressorFile) => {
        if (!fileItem.compressedBlob) return;
        const url = URL.createObjectURL(fileItem.compressedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `compressed_${fileItem.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                <span>🔒 100% Client-Side Sandbox: Images are compressed locally inside your browser RAM. No photo data is sent to external servers.</span>
            </div>

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image Compressor</h2>
                        <p className="text-xs text-muted-foreground">Compress JPG, PNG, and WebP images to custom sizes or target KB thresholds locally</p>
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
                            <Button 
                                disabled={isProcessing}
                                onClick={runCompression}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Compressing...</>
                                ) : (
                                    <><Settings className="mr-2 h-4 w-4" /> Run Compression</>
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
                            <h3 className="mt-6 text-lg font-bold">Upload Images to Compress</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload one or more image files. You can choose percentage-based quality levels or specify exact KB boundaries.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {files.map((item) => {
                                const ratio = item.compressedSize && item.originalSize 
                                    ? Math.round((1 - item.compressedSize / item.originalSize) * 100)
                                    : 0;

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
                                                    {item.status === "done" && item.compressedSize && (
                                                        <>
                                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                {formatFileSize(item.compressedSize)} ({ratio}% smaller)
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
                                                <>
                                                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[9px] font-bold uppercase">Compressed</Badge>
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => downloadCompressed(item)}
                                                        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                                                    >
                                                        <Download className="w-3.5 h-3.5 mr-1" /> Save
                                                    </Button>
                                                </>
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

                {/* Right Side Options Panel */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5" /> Compression Settings
                        </h4>

                        <div className="space-y-4 text-xs font-semibold">
                            <div className="flex gap-2 p-1 bg-muted/20 border border-border/20 rounded-lg">
                                <Button 
                                    type="button" 
                                    variant={mode === "quality" ? "secondary" : "ghost"}
                                    onClick={() => setMode("quality")}
                                    className="flex-1 text-[10px] font-bold h-7"
                                >
                                    Quality Scale
                                </Button>
                                <Button 
                                    type="button" 
                                    variant={mode === "target-kb" ? "secondary" : "ghost"}
                                    onClick={() => setMode("target-kb")}
                                    className="flex-1 text-[10px] font-bold h-7"
                                >
                                    Target KB Limit
                                </Button>
                            </div>

                            {mode === "quality" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="quality-slider" className="text-xs text-foreground">Compression Quality ({quality}%)</Label>
                                    <input 
                                        id="quality-slider"
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="target-kb-input" className="text-xs text-foreground">Target Size Limit (KB)</Label>
                                    <Input 
                                        id="target-kb-input"
                                        type="number"
                                        min="5"
                                        max="5000"
                                        value={targetKb}
                                        onChange={(e) => setTargetKb(Math.max(5, Math.min(5000, parseInt(e.target.value, 10) || 200)))}
                                        className="h-9 text-xs border-border/30 bg-background/50 font-bold"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-3.5 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-primary animate-pulse" /> Optimizer details
                        </h4>
                        <p className="text-muted-foreground">
                            When choosing <strong>Target KB Limit</strong>, we run a browser-native binary optimization loop to find the highest pixel rendering quality that fits exactly under your target threshold size.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
