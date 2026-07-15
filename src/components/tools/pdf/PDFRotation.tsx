"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download,
    Loader2,
    FileText,
    ShieldCheck,
    RotateCw,
    RotateCcw,
    RefreshCw,
    Grid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface PageState {
    pageNumber: number;
    rotation: number; // 0, 90, 180, 270
    dataUrl: string;
}

export default function PDFRotation() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageState[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadPreviews = async (pdfFile: File) => {
        setIsProcessing(true);
        setLoadingProgress(0);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const numPages = pdf.numPages;
            const newPages: PageState[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.35 });
                
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                
                newPages.push({
                    pageNumber: i,
                    rotation: 0,
                    dataUrl: canvas.toDataURL("image/jpeg", 0.75)
                });
                
                setLoadingProgress(Math.round((i / numPages) * 100));
            }
            
            setPages(newPages);
            toast.success(`PDF loaded with ${numPages} pages.`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load PDF previews locally.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setPages([]);
            await loadPreviews(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const rotatePage = (num: number, direction: 90 | -90) => {
        setPages(prev =>
            prev.map(p => {
                if (p.pageNumber === num) {
                    let newRotation = (p.rotation + direction) % 360;
                    if (newRotation < 0) newRotation += 360;
                    return { ...p, rotation: newRotation };
                }
                return p;
            })
        );
    };

    const rotateAll = (direction: 90 | -90) => {
        setPages(prev =>
            prev.map(p => {
                let newRotation = (p.rotation + direction) % 360;
                if (newRotation < 0) newRotation += 360;
                return { ...p, rotation: newRotation };
            })
        );
        toast.info(`Rotated all pages ${direction === 90 ? "90° Clockwise" : "90° Counter-Clockwise"}`);
    };

    const saveRotatedPDF = async () => {
        if (!file || pages.length === 0) {
            toast.error("Please upload a PDF file first");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument, degrees } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            const pdfPages = pdfDoc.getPages();

            pages.forEach(p => {
                if (p.rotation !== 0) {
                    const page = pdfPages[p.pageNumber - 1];
                    const currentRotation = page.getRotation().angle;
                    const finalRotation = (currentRotation + p.rotation) % 360;
                    page.setRotation(degrees(finalRotation));
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/i, "")}_rotated.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success("PDF pages rotated and saved successfully!");
            // Reload the newly rotated file
            const newFile = new File([blob], file.name, { type: "application/pdf" });
            setFile(newFile);
            setPages([]);
            await loadPreviews(newFile);
        } catch (error) {
            console.error(error);
            toast.error("Failed to rotate PDF document pages.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are rotated locally in RAM. No file bytes are sent to any remote server.</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <RotateCw className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Rotate PDF Pages</h2>
                        <p className="text-xs text-muted-foreground">Rotate specific pages or rotate all document pages at once locally</p>
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
                                onClick={() => rotateAll(90)}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <RotateCw className="mr-2 h-4 w-4" /> Rotate All 90° CW
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => rotateAll(-90)}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Rotate All 90° CCW
                            </Button>
                            <Button 
                                disabled={isProcessing}
                                onClick={saveRotatedPDF}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Saving...</>
                                ) : (
                                    <><Download className="mr-2 h-4 w-4" /> Save & Download PDF</>
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

            {/* Previews & Workspace */}
            <div className="space-y-6">
                {!file ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                    >
                        <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                            <RotateCw className="h-12 w-12 text-primary/40 group-hover:text-primary/60 animate-spin-slow" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">Upload PDF to Rotate</h3>
                        <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                            Click or drag a PDF document. You can rotate individual pages or the entire document clockwise.
                        </p>
                    </div>
                ) : isProcessing && pages.length === 0 ? (
                    <Card className="p-12 text-center border-border/40 bg-card/20 space-y-4 rounded-3xl">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                        <h3 className="font-bold text-base">Rendering Page Previews locally...</h3>
                        <Progress value={loadingProgress} className="max-w-xs mx-auto h-2" />
                        <p className="text-xs text-muted-foreground font-mono">{loadingProgress}% completed</p>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-muted/10 border border-border/30 rounded-2xl text-xs">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="font-bold text-foreground truncate max-w-xs">{file.name}</span>
                                <Badge variant="secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                            </div>
                            <span className="text-muted-foreground font-bold uppercase tracking-wider">
                                {pages.length} Pages Loaded
                            </span>
                        </div>

                        {/* Page Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {pages.map((p) => (
                                <div
                                    key={p.pageNumber}
                                    className="group relative flex flex-col items-center p-3 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/20 hover:border-primary/20 transition-all duration-300"
                                >
                                    {/* Rotate Controls */}
                                    <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => rotatePage(p.pageNumber, -90)}
                                            className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
                                            title="Rotate Counter-Clockwise"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => rotatePage(p.pageNumber, 90)}
                                            className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
                                            title="Rotate Clockwise"
                                        >
                                            <RotateCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Thumbnail with inline rotation style */}
                                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-border/10 bg-background shadow-inner mt-2 flex items-center justify-center">
                                        <div 
                                            style={{ transform: `rotate(${p.rotation}deg)` }}
                                            className="w-full h-full transition-transform duration-300 flex items-center justify-center"
                                        >
                                            <img
                                                src={p.dataUrl}
                                                alt={`Page ${p.pageNumber}`}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Page {p.pageNumber}
                                        </span>
                                        {p.rotation !== 0 && (
                                            <Badge variant="outline" className="text-[8px] font-extrabold uppercase px-1 py-0 border-primary/30 text-primary">
                                                {p.rotation}°
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
