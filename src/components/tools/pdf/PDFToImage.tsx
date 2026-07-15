"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Image as ImageIcon,
    Settings,
    Grid,
    CheckSquare,
    Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface PageImage {
    pageNumber: number;
    dataUrl: string;
    selected: boolean;
}

export default function PDFToImage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
    const [scale, setScale] = useState<number>(2); // 1 = Standard, 2 = High (300 dpi equivalent), 3 = Ultra
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadPdf = async (pdfFile: File) => {
        setIsProcessing(true);
        setProgress(0);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const numPages = pdf.numPages;
            const newPages: PageImage[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.35 }); // preview scale
                
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                
                newPages.push({
                    pageNumber: i,
                    dataUrl: canvas.toDataURL("image/jpeg", 0.75),
                    selected: true
                });
                
                setProgress(Math.round((i / numPages) * 100));
            }
            
            setPages(newPages);
            toast.success(`PDF loaded with ${numPages} pages.`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to render PDF page previews locally.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setPages([]);
            await loadPdf(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const togglePageSelection = (num: number) => {
        setPages(prev =>
            prev.map(p => p.pageNumber === num ? { ...p, selected: !p.selected } : p)
        );
    };

    const selectAll = (val: boolean) => {
        setPages(prev => prev.map(p => ({ ...p, selected: val })));
    };

    const extractImages = async () => {
        if (!file || pages.length === 0) return;
        const selectedList = pages.filter(p => p.selected);
        if (selectedList.length === 0) {
            toast.error("Please select at least 1 page to convert.");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            // Import JSZip
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let extractedCount = 0;
            const baseName = file.name.replace(/\.pdf$/i, "");

            for (let i = 0; i < selectedList.length; i++) {
                const item = selectedList[i];
                const page = await pdf.getPage(item.pageNumber);
                const viewport = page.getViewport({ scale: scale }); // Use custom resolution scale

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                let imageType = "image/png";
                let extension = ".png";
                if (format === "jpeg") {
                    imageType = "image/jpeg";
                    extension = ".jpg";
                } else if (format === "webp") {
                    imageType = "image/webp";
                    extension = ".webp";
                }

                // Extract base64 clean data
                const dataUrl = canvas.toDataURL(imageType, 0.95);
                const base64Data = dataUrl.split(",")[1];

                zip.file(`${baseName}_page_${item.pageNumber}${extension}`, base64Data, { base64: true });
                
                extractedCount++;
                setProgress(Math.round((extractedCount / selectedList.length) * 100));
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            const zipUrl = URL.createObjectURL(zipContent);
            
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = `${baseName}_images.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(zipUrl);

            toast.success(`Successfully converted and downloaded ${extractedCount} pages in a ZIP archive!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert PDF pages to images.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are converted locally. We generate images inside your browser with zero remote uploads.</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF to Image Converter</h2>
                        <p className="text-xs text-muted-foreground">Extract pages of your PDF document as high-resolution PNG, JPG, or WebP images locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change PDF" : "Select PDF"}
                    </Button>
                    {pages.length > 0 && (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => selectAll(true)}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <CheckSquare className="mr-2 h-4 w-4" /> Select All
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => selectAll(false)}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <Square className="mr-2 h-4 w-4" /> Clear
                            </Button>
                            <Button 
                                disabled={isProcessing}
                                onClick={extractImages}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Converting...</>
                                ) : (
                                    <><Download className="mr-2 h-4 w-4" /> Convert & Zip Images</>
                                )}
                            </Button>
                        </>
                    )}
                </div>
                <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </div>

            {/* Workspace & Preview */}
            <div className="space-y-6">
                {!file ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                    >
                        <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                            <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">Upload PDF to Extract Images</h3>
                        <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                            Click or drag a PDF document. You can select individual pages to convert and download as a ZIP file.
                        </p>
                    </div>
                ) : isProcessing && pages.length === 0 ? (
                    <Card className="p-12 text-center border-border/40 bg-card/20 space-y-4 rounded-3xl">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                        <h3 className="font-bold text-base">Preparing Page Previews...</h3>
                        <Progress value={progress} className="max-w-xs mx-auto h-2" />
                        <p className="text-xs text-muted-foreground font-mono">{progress}% completed</p>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Controls */}
                            <Card className="md:col-span-2 p-5 border border-border/30 bg-card/10 rounded-2xl flex flex-wrap items-center gap-6 text-xs font-semibold">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-primary shrink-0" />
                                    <span>Resolution:</span>
                                    <select
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="h-8 px-2 rounded-lg border border-border/35 bg-background text-xs"
                                    >
                                        <option value="1">Standard Quality (150 DPI)</option>
                                        <option value="2">High Quality (300 DPI)</option>
                                        <option value="3">Ultra-HD Quality (450 DPI)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Image Format:</span>
                                    <select
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value as any)}
                                        className="h-8 px-2 rounded-lg border border-border/35 bg-background text-xs"
                                    >
                                        <option value="png">PNG (Transparent)</option>
                                        <option value="jpeg">JPG (Standard)</option>
                                        <option value="webp">WebP (Optimized)</option>
                                    </select>
                                </div>
                            </Card>

                            <div className="flex items-center justify-end text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">
                                {pages.filter(p => p.selected).length} of {pages.length} Pages Selected
                            </div>
                        </div>

                        {isProcessing && (
                            <Card className="p-5 border border-border/30 bg-card/25 rounded-2xl space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span>Rendering high-resolution images...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </Card>
                        )}

                        {/* Page Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {pages.map((p) => (
                                <div
                                    key={p.pageNumber}
                                    onClick={() => togglePageSelection(p.pageNumber)}
                                    className={`group relative cursor-pointer flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                                        p.selected 
                                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[0.98]" 
                                            : "border-border/40 bg-card/10 hover:bg-card/30 hover:border-primary/20 hover:scale-[1.01]"
                                    }`}
                                >
                                    {/* Selection checkbox indicator */}
                                    <div className={`absolute top-2 right-2 z-20 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                        p.selected 
                                            ? "bg-primary border-primary text-primary-foreground scale-110" 
                                            : "bg-background/85 border-border/60 text-transparent"
                                    }`}>
                                        <span className="text-[10px] font-bold">✓</span>
                                    </div>

                                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-border/10 bg-background shadow-inner mt-2">
                                        <img
                                            src={p.dataUrl}
                                            alt={`Page ${p.pageNumber}`}
                                            className="w-full h-full object-contain pointer-events-none"
                                        />
                                    </div>
                                    <span className="mt-3 text-xs font-bold text-muted-foreground">
                                        Page {p.pageNumber}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
