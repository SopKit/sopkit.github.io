"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Trash2,
    Loader2,
    FileText,
    ShieldCheck,
    Check,
    Grid,
    Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface PageItem {
    pageNumber: number;
    dataUrl: string;
}

export default function PDFPageDelete() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageItem[]>([]);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadPreviews = async (pdfFile: File) => {
        setIsProcessing(true);
        setLoadingProgress(0);
        try {
            // Dynamically import pdfjs-dist
            const pdfjsLib = await import("pdfjs-dist");
            // Set worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const numPages = pdf.numPages;
            const newPages: PageItem[] = [];

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
            setSelectedPages([]);
            await loadPreviews(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = ""; // Reset
    }, []);

    const toggleSelection = (num: number) => {
        setSelectedPages(prev => 
            prev.includes(num) 
                ? prev.filter(p => p !== num) 
                : [...prev, num]
        );
    };

    const selectAll = () => {
        setSelectedPages(pages.map(p => p.pageNumber));
    };

    const selectNone = () => {
        setSelectedPages([]);
    };

    const deletePages = async () => {
        if (!file || selectedPages.length === 0) {
            toast.error("Please select pages to delete.");
            return;
        }

        if (selectedPages.length === pages.length) {
            toast.error("Cannot delete all pages from a PDF. At least 1 page must remain.");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Sort selected pages in descending order to avoid index shift issues
            const indicesToRemove = selectedPages
                .map(num => num - 1)
                .sort((a, b) => b - a);

            indicesToRemove.forEach(index => {
                pdfDoc.removePage(index);
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/i, "")}_modified.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success("Selected pages deleted successfully!");
            // Reload the preview of the newly created PDF
            const newFile = new File([blob], file.name, { type: "application/pdf" });
            setFile(newFile);
            setPages([]);
            setSelectedPages([]);
            await loadPreviews(newFile);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete pages.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are processed entirely in browser memory. We never transmit files to a server.</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Remove PDF Pages</h2>
                        <p className="text-xs text-muted-foreground">Select and discard unwanted pages from your document locally</p>
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
                                onClick={selectAll}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <Grid className="mr-2 h-4 w-4" /> Select All
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={selectNone}
                                className="border-border hover:bg-muted/40 text-xs font-bold"
                            >
                                <Square className="mr-2 h-4 w-4" /> Clear Selection
                            </Button>
                            <Button 
                                disabled={selectedPages.length === 0 || isProcessing}
                                onClick={deletePages}
                                className="bg-destructive hover:bg-destructive/90 text-xs font-bold text-white shadow-md shadow-destructive/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Deleting...</>
                                ) : (
                                    <><Trash2 className="mr-2 h-4 w-4" /> Delete {selectedPages.length} Pages</>
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
                            <Trash2 className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">Upload PDF to Select Pages</h3>
                        <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                            Click or drag a PDF document. You can preview pages and select specific numbers to discard.
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
                                {selectedPages.length} of {pages.length} Pages Selected
                            </span>
                        </div>

                        {/* Page Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {pages.map((p) => {
                                const isSelected = selectedPages.includes(p.pageNumber);
                                return (
                                    <div
                                        key={p.pageNumber}
                                        onClick={() => toggleSelection(p.pageNumber)}
                                        className={`group relative cursor-pointer flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                                            isSelected 
                                                ? "border-destructive bg-destructive/5 shadow-md shadow-destructive/5 scale-[0.98]" 
                                                : "border-border/40 bg-card/10 hover:bg-card/30 hover:border-primary/20 hover:scale-[1.01]"
                                        }`}
                                    >
                                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-border/10 bg-background shadow-inner">
                                            <img
                                                src={p.dataUrl}
                                                alt={`Page ${p.pageNumber}`}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                            {/* Selection indicator */}
                                            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                                isSelected 
                                                    ? "bg-destructive border-destructive text-white scale-110" 
                                                    : "bg-background/80 border-border/60 text-transparent group-hover:border-primary"
                                            }`}>
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                        </div>
                                        <span className={`mt-3 text-xs font-bold ${isSelected ? "text-destructive" : "text-muted-foreground"}`}>
                                            Page {p.pageNumber}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
