"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
    Download,
    ImageIcon,
    Loader2,
    X,
    Settings,
    ArrowRight,
    AlertCircle,
    Copy,
    Check,
    RefreshCw,
    Sparkles,
    Sliders,
    Layers,
    Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    ToolDropzone,
    ToolModeTabs,
    DS,
} from "@/components/tools/shared/design-system";

export type CompressorStatus = "pending" | "processing" | "done" | "target-unattainable" | "failed";

export interface CompressorFile {
    id: string;
    file: File;
    name: string;
    originalSize: number;
    preview: string;
    width: number;
    height: number;
    compressedBlob: Blob | null;
    compressedSize: number | null;
    compressedPreview: string | null;
    status: CompressorStatus;
    statusMessage?: string;
}

export function evaluateTargetSizeStatus(
    blobSize: number,
    targetKb: number
): { status: "done" | "target-unattainable"; statusMessage?: string } {
    const targetBytes = targetKb * 1024;
    if (blobSize <= targetBytes) {
        return { status: "done" };
    }
    return {
        status: "target-unattainable",
        statusMessage: `Target ${targetKb} KB is unattainable without resizing image dimensions.`,
    };
}

function formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function ImageCompressorTool() {
    const [files, setFiles] = useState<CompressorFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<"quality" | "target-kb">("quality");
    const [quality, setQuality] = useState<number>(80);
    const [targetKb, setTargetKb] = useState<number>(200);
    const [format, setFormat] = useState<"webp" | "jpeg" | "png" | "original">("webp");
    const [viewMode, setViewMode] = useState<"side" | "compressed">("side");
    const [copied, setCopied] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Clean up created object URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach((f) => {
                try {
                    URL.revokeObjectURL(f.preview);
                    if (f.compressedPreview) URL.revokeObjectURL(f.compressedPreview);
                } catch {
                    // Ignore revoke errors
                }
            });
        };
    }, [files]);

    const addFiles = useCallback((incoming: File[]) => {
        const imageFiles = incoming.filter((f) => f.type.startsWith("image/"));
        if (imageFiles.length === 0) {
            toast.error("Please select valid image files (JPG, PNG, WebP).");
            return;
        }

        const newFiles: CompressorFile[] = [];
        let loadedCount = 0;

        imageFiles.forEach((file) => {
            const preview = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                const item: CompressorFile = {
                    id: Math.random().toString(36).substring(2, 9),
                    file,
                    name: file.name,
                    originalSize: file.size,
                    preview,
                    width: img.width,
                    height: img.height,
                    compressedBlob: null,
                    compressedSize: null,
                    compressedPreview: null,
                    status: "pending",
                };
                newFiles.push(item);
                loadedCount++;

                if (loadedCount === imageFiles.length) {
                    setFiles((prev) => {
                        const updated = [...prev, ...newFiles];
                        if (!activeFileId && updated[0]) {
                            setActiveFileId(updated[0].id);
                        }
                        return updated;
                    });
                    toast.success(`${newFiles.length} image(s) loaded.`);
                }
            };
            img.onerror = () => {
                loadedCount++;
            };
            img.src = preview;
        });
    }, [activeFileId]);

    // Global clipboard paste listener (Ctrl+V / Cmd+V anywhere on page)
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (!e.clipboardData?.items) return;
            const pastedFiles: File[] = [];
            for (const item of Array.from(e.clipboardData.items)) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) pastedFiles.push(file);
                }
            }
            if (pastedFiles.length > 0) {
                e.preventDefault();
                addFiles(pastedFiles);
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [addFiles]);

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const fileItem = prev.find((f) => f.id === id);
            if (fileItem) {
                try {
                    URL.revokeObjectURL(fileItem.preview);
                    if (fileItem.compressedPreview) URL.revokeObjectURL(fileItem.compressedPreview);
                } catch {
                    // Ignore revoke errors
                }
            }
            const filtered = prev.filter((f) => f.id !== id);
            if (activeFileId === id) {
                setActiveFileId(filtered[0]?.id || null);
            }
            return filtered;
        });
    };

    const clearAll = () => {
        files.forEach((f) => {
            try {
                URL.revokeObjectURL(f.preview);
                if (f.compressedPreview) URL.revokeObjectURL(f.compressedPreview);
            } catch {
                // Ignore revoke errors
            }
        });
        setFiles([]);
        setActiveFileId(null);
    };

    const compressSingleImage = useCallback(
        async (fileItem: CompressorFile): Promise<CompressorFile> => {
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

            // Determine target mime type
            let mimeType = "image/webp";
            if (format === "jpeg") mimeType = "image/jpeg";
            else if (format === "png") mimeType = "image/png";
            else if (format === "original") mimeType = fileItem.file.type || "image/jpeg";

            let compressedBlob: Blob | null = null;
            let fileStatus: CompressorStatus = "done";
            let statusMessage: string | undefined = undefined;

            if (mode === "quality") {
                const qualityValue = quality / 100;
                compressedBlob = await new Promise<Blob | null>((res) => {
                    canvas.toBlob((b) => res(b), mimeType, qualityValue);
                });
                fileStatus = "done";
            } else {
                // Binary search to find optimal compression quality fitting under targetKb
                let low = 0.05,
                    high = 0.98;
                let bestBlob: Blob | null = null;

                for (let i = 0; i < 7; i++) {
                    const mid = (low + high) / 2;
                    const blob = await new Promise<Blob | null>((res) => {
                        canvas.toBlob((b) => res(b), mimeType, mid);
                    });

                    if (blob && blob.size <= targetKb * 1024) {
                        bestBlob = blob;
                        low = mid;
                    } else {
                        high = mid;
                    }
                }

                if (!bestBlob) {
                    bestBlob = await new Promise<Blob | null>((res) => {
                        canvas.toBlob((b) => res(b), mimeType, 0.05);
                    });
                }
                compressedBlob = bestBlob;

                if (compressedBlob) {
                    const evaluation = evaluateTargetSizeStatus(compressedBlob.size, targetKb);
                    fileStatus = evaluation.status;
                    statusMessage = evaluation.statusMessage;
                }
            }

            if (!compressedBlob) throw new Error("Compression failed");

            const compressedPreview = URL.createObjectURL(compressedBlob);

            return {
                ...fileItem,
                compressedBlob,
                compressedSize: compressedBlob.size,
                compressedPreview,
                status: fileStatus,
                statusMessage,
            };
        },
        [mode, quality, targetKb, format]
    );

    // Auto-recompress active file when settings change
    useEffect(() => {
        if (files.length === 0) return;

        const timer = setTimeout(async () => {
            setIsProcessing(true);
            try {
                const updated = await Promise.all(
                    files.map((fileItem) => compressSingleImage(fileItem))
                );
                if (isMountedRef.current) {
                    setFiles(updated);
                }
            } catch (err) {
                console.error("Auto compression error:", err);
            } finally {
                if (isMountedRef.current) {
                    setIsProcessing(false);
                }
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [quality, targetKb, mode, format, files.length, compressSingleImage]);

    const activeFile = files.find((f) => f.id === activeFileId) || files[0];

    const handleDownload = (fileItem: CompressorFile) => {
        if (!fileItem.compressedBlob) return;
        const extension = format === "webp" ? "webp" : format === "png" ? "png" : "jpg";
        const baseName = fileItem.name.replace(/\.[^/.]+$/, "");
        const finalName = `${baseName}-compressed.${extension}`;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(fileItem.compressedBlob);
        link.download = finalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success(`Downloaded ${finalName}`);
    };

    const handleCopyImage = async (fileItem: CompressorFile) => {
        if (!fileItem.compressedBlob) return;
        try {
            // PNG can be copied to clipboard directly in modern browsers
            if (fileItem.compressedBlob.type === "image/png") {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": fileItem.compressedBlob }),
                ]);
                setCopied(true);
                toast.success("Image copied to clipboard!");
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Convert blob to PNG for clipboard compatibility
                const img = new Image();
                img.src = URL.createObjectURL(fileItem.compressedBlob);
                await new Promise((r) => (img.onload = r));
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob(async (pngBlob) => {
                    if (pngBlob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ "image/png": pngBlob }),
                        ]);
                        setCopied(true);
                        toast.success("Image copied to clipboard!");
                        setTimeout(() => setCopied(false), 2000);
                    }
                }, "image/png");
            }
        } catch (e) {
            toast.error("Could not copy image to clipboard.");
        }
    };

    // Calculate savings
    const origSize = activeFile?.originalSize || 0;
    const compSize = activeFile?.compressedSize || 0;
    const savingsPercent =
        origSize && compSize && compSize < origSize
            ? Math.round(((origSize - compSize) / origSize) * 100)
            : 0;

    // 1. Initial State: Clean, Task-First Dropzone
    if (files.length === 0) {
        return (
            <div className="space-y-4">
                <ToolDropzone
                    onFiles={addFiles}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple={true}
                    title="Drop images here to compress"
                    subtitle="or choose files · press Cmd+V / Ctrl+V to paste from clipboard"
                    icon={<ImageIcon className="w-6 h-6 text-primary" />}
                />

                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground px-2">
                    <span>Supported formats: JPG, PNG, WebP, AVIF</span>
                    <span>100% In-Browser · No Upload Limits</span>
                </div>
            </div>
        );
    }

    // 2. Active Squoosh-Style Workspace
    return (
        <div className="space-y-6">
            {/* Top Workspace Bar: Active File Selector & Global Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 overflow-x-auto max-w-xl py-0.5">
                    {files.map((f, i) => {
                        const isCurrent = f.id === activeFile?.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setActiveFileId(f.id)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                    isCurrent
                                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                        : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                <span className="truncate max-w-[120px]">{f.name}</span>
                                {files.length > 1 && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(f.id);
                                        }}
                                        className="hover:text-red-400 ml-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    <label className="cursor-pointer text-xs font-medium px-2 py-1 rounded-lg border border-dashed border-border/80 hover:border-primary text-muted-foreground hover:text-primary transition-colors shrink-0">
                        + Add
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Live KPI Metric Counter Bar */}
            <div className={DS.kpiBar.container}>
                <div className={DS.kpiBar.item}>
                    <span className={DS.kpiBar.label}>Original Size</span>
                    <span className={DS.kpiBar.value}>{formatBytes(origSize)}</span>
                </div>
                <div className={DS.kpiBar.item}>
                    <span className={DS.kpiBar.label}>Compressed Size</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {compSize ? formatBytes(compSize) : "Processing..."}
                    </span>
                </div>
                <div className={DS.kpiBar.item}>
                    <span className={DS.kpiBar.label}>Saved Ratio</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {savingsPercent > 0 ? `-${savingsPercent}%` : compSize ? "0%" : "..."}
                    </span>
                </div>
                <div className={DS.kpiBar.item}>
                    <span className={DS.kpiBar.label}>Dimensions</span>
                    <span className={DS.kpiBar.value}>
                        {activeFile ? `${activeFile.width} × ${activeFile.height}` : "—"}
                    </span>
                </div>
            </div>

            {/* Workspace Grid: Left/Center Preview + Right Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Image Viewport */}
                <div className="lg:col-span-8 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">Preview</span>
                            {isProcessing && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                    Optimizing...
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60 text-xs">
                            <button
                                onClick={() => setViewMode("side")}
                                className={`px-2 py-0.5 rounded-md transition-all ${
                                    viewMode === "side" ? "bg-background text-foreground shadow-xs font-medium" : "text-muted-foreground"
                                }`}
                            >
                                Side-by-Side
                            </button>
                            <button
                                onClick={() => setViewMode("compressed")}
                                className={`px-2 py-0.5 rounded-md transition-all ${
                                    viewMode === "compressed" ? "bg-background text-foreground shadow-xs font-medium" : "text-muted-foreground"
                                }`}
                            >
                                Output Only
                            </button>
                        </div>
                    </div>

                    {/* Image Viewport Container */}
                    <div className="relative rounded-xl border border-border/70 bg-muted/15 p-4 min-h-[360px] flex items-center justify-center overflow-hidden">
                        {viewMode === "side" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                                <div className="flex flex-col gap-1.5 items-center">
                                    <div className="relative w-full h-64 sm:h-72 rounded-lg border border-border/40 bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={activeFile.preview}
                                            alt="Original image"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                        Original · {formatBytes(origSize)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5 items-center">
                                    <div className="relative w-full h-64 sm:h-72 rounded-lg border border-border/40 bg-black/5 dark:bg-black/20 flex items-center justify-center overflow-hidden">
                                        {activeFile.compressedPreview ? (
                                            <img
                                                src={activeFile.compressedPreview}
                                                alt="Compressed image"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        )}
                                    </div>
                                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                        Compressed · {formatBytes(compSize)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full h-80 flex items-center justify-center">
                                {activeFile.compressedPreview ? (
                                    <img
                                        src={activeFile.compressedPreview}
                                        alt="Compressed output"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Settings Panel */}
                <div className="lg:col-span-4 rounded-xl border border-border/70 bg-muted/20 p-5 space-y-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-primary" />
                            Compression Settings
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">Instant Live</span>
                    </div>

                    {/* Mode Switcher */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Optimization Mode</Label>
                        <ToolModeTabs
                            tabs={[
                                { value: "quality", label: "Visual Quality" },
                                { value: "target-kb", label: "Target KB Size" },
                            ]}
                            value={mode}
                            onChange={(m) => setMode(m as "quality" | "target-kb")}
                        />
                    </div>

                    {/* Mode Controls */}
                    {mode === "quality" ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <Label className="text-xs font-medium">Quality Ratio</Label>
                                <span className="font-mono font-bold text-primary">{quality}%</span>
                            </div>
                            <Slider
                                min={5}
                                max={100}
                                step={1}
                                value={[quality]}
                                onValueChange={(val) => setQuality(val[0])}
                                className="py-2"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                                <span>Smaller file</span>
                                <span>Balanced (80%)</span>
                                <span>Lossless</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <Label className="text-xs font-medium">Target Max File Size</Label>
                                <span className="font-mono font-bold text-primary">{targetKb} KB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={10}
                                    max={10000}
                                    value={targetKb}
                                    onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 50))}
                                    className="h-8 text-xs font-mono"
                                />
                                <span className="text-xs text-muted-foreground font-mono">KB</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-1">
                                {[50, 100, 200, 500].map((kb) => (
                                    <button
                                        key={kb}
                                        onClick={() => setTargetKb(kb)}
                                        className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                                            targetKb === kb
                                                ? "border-primary bg-primary/10 text-primary font-bold"
                                                : "border-border/60 text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {kb}KB
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Output Format Picker */}
                    <div className="space-y-1.5 pt-2 border-t border-border/60">
                        <Label className="text-xs text-muted-foreground">Output Format</Label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-muted/60 border border-border/60 rounded-lg text-xs font-medium">
                            {(["webp", "jpeg", "png", "original"] as const).map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormat(fmt)}
                                    className={`py-1 rounded text-center uppercase tracking-wider text-[10px] font-mono transition-all ${
                                        format === fmt
                                            ? "bg-background text-foreground shadow-xs font-bold"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="space-y-2 pt-3 border-t border-border/60">
                        <Button
                            onClick={() => handleDownload(activeFile)}
                            className="w-full gap-2 text-xs font-semibold h-10 shadow-xs"
                            disabled={!activeFile.compressedBlob}
                        >
                            <Download className="w-4 h-4" />
                            Download {formatBytes(compSize)}
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyImage(activeFile)}
                                className="h-8 text-xs gap-1.5 border-border/60"
                                disabled={!activeFile.compressedBlob}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Image</span>
                                    </>
                                )}
                            </Button>

                            <label className="cursor-pointer">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="w-full h-8 text-xs gap-1.5 border-border/60"
                                >
                                    <span>
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Add Images
                                    </span>
                                </Button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
