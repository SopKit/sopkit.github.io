"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    ImageIcon, 
    Loader2, 
    X,
    Settings,
    FileText,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    ToolShell,
    ToolDropzone,
    ToolModeTabs,
    ToolField,
    ToolPanel,
    ToolSectionTitle,
} from "@/components/tools/shared/design-system";

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

    const addFiles = useCallback((incoming: File[]) => {
        const newFiles = incoming.map(file => ({
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
    }, []);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
        e.target.value = "";
    }, [addFiles]);

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
        <ToolShell>
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
                        <ToolDropzone
                            title="Upload Images to Compress"
                            subtitle="Upload one or more image files. You can choose percentage-based quality levels or specify exact KB boundaries."
                            accept="image/*"
                            multiple
                            onFiles={addFiles}
                            icon={<ImageIcon className="h-8 w-8" />}
                        />
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
                    <ToolPanel className="p-5">
                        <ToolSectionTitle icon={<Settings className="w-3.5 h-3.5" />}>
                            Compression Settings
                        </ToolSectionTitle>

                        <div className="space-y-4 text-xs font-semibold">
                            <ToolModeTabs
                                tabs={[
                                    { value: "quality", label: "Quality Scale" },
                                    { value: "target-kb", label: "Target KB Limit" },
                                ]}
                                value={mode}
                                onChange={(v) => setMode(v as "quality" | "target-kb")}
                            />

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
                                <ToolField
                                    fieldId="target-kb-input"
                                    label="Target Size Limit (KB)"
                                    type="number"
                                    min={5}
                                    max={5000}
                                    value={targetKb}
                                    onChange={(e) => setTargetKb(Math.max(5, Math.min(5000, parseInt(e.target.value, 10) || 200)))}
                                />
                            )}
                        </div>
                    </ToolPanel>

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
        </ToolShell>
    );
}
