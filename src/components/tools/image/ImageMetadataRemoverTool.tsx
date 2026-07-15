"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    Loader2,
    ShieldCheck,
    Image as ImageIcon,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function ImageMetadataRemoverTool() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cleanBlob, setCleanBlob] = useState<Blob | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [tagsCount, setTagsCount] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const checkTagsCount = async (imgFile: File) => {
        try {
            const ExifReader = (await import("exifreader")).default;
            const arrayBuffer = await imgFile.arrayBuffer();
            const tags = ExifReader.load(arrayBuffer);
            const count = Object.keys(tags).length;
            setTagsCount(count);
        } catch (e) {
            setTagsCount(0);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setCleanBlob(null);
            setDownloadUrl(null);
            setTagsCount(null);
            
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);

            await checkTagsCount(selectedFile);
            toast.success("Image loaded. Press Clean Metadata to sanitize.");
        } else if (selectedFile) {
            toast.error("Please select a valid image file");
        }
        e.target.value = "";
    }, []);

    const stripMetadata = async () => {
        if (!file || !previewUrl) return;

        setIsProcessing(true);
        try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            // Draw image on canvas, stripping original exif blocks
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context is missing");

            ctx.drawImage(img, 0, 0);

            const mimeType = file.type || "image/jpeg";
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((b) => resolve(b), mimeType, 0.95);
            });

            if (!blob) throw new Error("Blob compilation failed");

            setCleanBlob(blob);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("EXIF, GPS, and camera metadata successfully removed!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to strip metadata from image.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Metadata stripping happens entirely locally in your browser memory. No files are uploaded or stored.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image Metadata Stripper</h2>
                        <p className="text-xs text-muted-foreground">Remove EXIF, GPS, device details, and creation tags from photos locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change Image" : "Select Image"}
                    </Button>
                    {file && !cleanBlob && (
                        <Button 
                            disabled={isProcessing}
                            onClick={stripMetadata}
                            className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                        >
                            {isProcessing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Stripping...</>
                            ) : (
                                <><Trash2 className="mr-2 h-4 w-4" /> Strip Metadata</>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Image to Strip Info</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload JPG, PNG, or WebP. We rasterize the pixel layers on a clean canvas to drop all metadata headers.
                            </p>
                        </div>
                    ) : (
                        <Card className="border border-border/40 bg-white overflow-hidden shadow-lg rounded-3xl">
                            <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-foreground">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider truncate max-w-xs">{file.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    {tagsCount !== null && (
                                        <Badge variant="secondary" className="text-[9px] font-bold">
                                            {tagsCount > 0 ? `${tagsCount} EXIF Tags Found` : "No Metadata Detected"}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Local File</Badge>
                                </div>
                            </div>
                            <div className="p-8 flex items-center justify-center bg-muted/5 min-h-[300px]">
                                {previewUrl && (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="max-h-[350px] object-contain rounded-2xl border shadow" 
                                    />
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">What is stripped?</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• GPS Latitude, Longitude, and Altitude.</li>
                            <li>• Camera Model, F-stop, ISO, and Exposure.</li>
                            <li>• Creation Timestamp and Editor software tags.</li>
                        </ul>
                    </Card>
                    
                    {downloadUrl && (
                        <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3 text-xs leading-relaxed animate-in">
                            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sanitized Image Ready!
                            </h4>
                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                                <a href={downloadUrl} download={`sanitized_${file!.name}`}>
                                    <Download className="w-4 h-4 mr-2" /> Download Clean Image
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
