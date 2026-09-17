"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
    Upload, 
    Download, 
    ImageIcon, 
    Loader2, 
    X,
    Settings,
    ArrowRight,
    Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
    ToolShell,
    ToolDropzone,
    ToolField,
    ToolPanel,
    ToolSectionTitle,
} from "@/components/tools/shared/design-system";

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

    // Sync outputFormat when defaultOutputFormat changes
    useEffect(() => {
        if (defaultOutputFormat) {
            setOutputFormat(defaultOutputFormat);
        }
    }, [defaultOutputFormat]);

    // Clean up previews on unmount to prevent object URL memory leaks
    useEffect(() => {
        return () => {
            files.forEach(f => {
                if (f.preview) URL.revokeObjectURL(f.preview);
            });
        };
    }, []);

    const addFiles = useCallback((incoming: File[]) => {
        const newFiles = incoming.map(file => ({
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
        toast.success(`${newFiles.length} image${newFiles.length > 1 ? "s" : ""} added to queue.`);
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

    const handleFormatChange = (newFormat: string) => {
        setOutputFormat(newFormat);
        // Reset converted items so user can re-convert with new format
        setFiles(prev => prev.map(f => f.status === "done" ? { ...f, status: "pending", convertedBlob: null, convertedSize: null } : f));
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

        let mimeType = "image/png";
        if (outputFormat === "jpeg" || outputFormat === "jpg") mimeType = "image/jpeg";
        else if (outputFormat === "webp") mimeType = "image/webp";
        else if (outputFormat === "bmp") mimeType = "image/bmp";

        // For JPEG, fill transparent backgrounds with white to prevent black artifacts
        if (mimeType === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

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

    const downloadSingle = (item: ConverterFile) => {
        if (!item.convertedBlob) return;
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const baseName = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
        const url = URL.createObjectURL(item.convertedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${baseName}_converted.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${baseName}_converted.${ext}`);
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
        <ToolShell>
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
                        <ToolDropzone
                            title="Upload Images to Convert"
                            subtitle="Choose one or more images. Configure output format parameters, scaling, and quality values."
                            accept="image/*"
                            multiple
                            onFiles={addFiles}
                            icon={<ImageIcon className="h-8 w-8" />}
                        />
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
                                            {item.status === "done" && item.convertedBlob && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Download converted image"
                                                    onClick={() => downloadSingle(item)}
                                                    className="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                title="Remove file"
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
                    <ToolPanel className="p-5">
                        <ToolSectionTitle icon={<Settings className="w-3.5 h-3.5" />}>
                            Output Settings
                        </ToolSectionTitle>

                        <div className="space-y-4 text-xs font-semibold">
                            <div className="space-y-2">
                                <Label htmlFor="format-select" className="text-xs text-foreground">Target Format</Label>
                                <select
                                    id="format-select"
                                    value={outputFormat}
                                    onChange={(e) => handleFormatChange(e.target.value)}
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
                                <ToolField
                                    fieldId="width-input"
                                    label="Width (px)"
                                    type="number"
                                    placeholder="Auto"
                                    value={widthInput}
                                    onChange={(e) => setWidthInput(e.target.value)}
                                />
                                <ToolField
                                    fieldId="height-input"
                                    label="Height (px)"
                                    type="number"
                                    placeholder="Auto"
                                    value={heightInput}
                                    onChange={(e) => setHeightInput(e.target.value)}
                                />
                            </div>
                        </div>
                    </ToolPanel>

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
        </ToolShell>
    );
}
