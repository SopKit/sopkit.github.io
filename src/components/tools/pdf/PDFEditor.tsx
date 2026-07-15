"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Type,
    ChevronLeft,
    ChevronRight,
    Save,
    Trash2,
    Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Annotation {
    id: string;
    page: number;
    text: string;
    x: number; // canvas X
    y: number; // canvas Y
    fontSize: number;
    color: string; // "black" | "red" | "blue"
}

export default function PDFEditor() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [activeTool, setActiveTool] = useState<"text" | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("black");
    const [selectedFontSize, setSelectedFontSize] = useState<number>(14);
    const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pdfDocumentRef = useRef<any>(null);

    const renderPage = async (pageNum: number) => {
        if (!pdfDocumentRef.current) return;
        try {
            const page = await pdfDocumentRef.current.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.3 });
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext("2d");
            if (!context) return;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            // Render existing annotations for this page on canvas overlay
            drawAnnotationsOverlay();
        } catch (err) {
            console.error("Failed to render PDF page:", err);
        }
    };

    const drawAnnotationsOverlay = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Note: Instead of canvas drawing, we will render absolute overlay divs on top of the canvas
        // inside the react render loop to support rich user typing inputs! This is a much better UX!
    };

    const loadPDF = async (pdfFile: File) => {
        setIsProcessing(true);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            pdfDocumentRef.current = pdf;
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
            setAnnotations([]);
            await renderPage(1);
            toast.success(`PDF loaded with ${pdf.numPages} pages.`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load PDF preview.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            await loadPDF(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    // Re-render canvas when changing page
    useEffect(() => {
        if (file && pdfDocumentRef.current) {
            renderPage(currentPage);
        }
    }, [currentPage, file]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool !== "text" || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newAnn: Annotation = {
            id: Math.random().toString(36).substring(2, 9),
            page: currentPage,
            text: "Text Annotation",
            x,
            y,
            fontSize: selectedFontSize,
            color: selectedColor,
        };

        setAnnotations(prev => [...prev, newAnn]);
        setEditingAnnotationId(newAnn.id);
        setActiveTool(null);
    };

    const deleteAnnotation = (id: string) => {
        setAnnotations(prev => prev.filter(a => a.id !== id));
        if (editingAnnotationId === id) setEditingAnnotationId(null);
    };

    const updateAnnotationText = (id: string, text: string) => {
        setAnnotations(prev =>
            prev.map(a => a.id === id ? { ...a, text } : a)
        );
    };

    const updateAnnotationSize = (id: string, fontSize: number) => {
        setAnnotations(prev =>
            prev.map(a => a.id === id ? { ...a, fontSize } : a)
        );
    };

    const updateAnnotationColor = (id: string, color: string) => {
        setAnnotations(prev =>
            prev.map(a => a.id === id ? { ...a, color } : a)
        );
    };

    const savePDF = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pagesList = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            for (const ann of annotations) {
                const page = pagesList[ann.page - 1];
                const { width, height } = page.getSize();
                
                // Convert canvas coordinates back to PDF points
                const pdfX = (ann.x / canvasWidth) * width;
                // PDF Y starts from the bottom of the page, canvas starts from the top
                const pdfY = height - ((ann.y / canvasHeight) * height) - (ann.fontSize * 0.7);

                let colorVal = rgb(0, 0, 0); // black
                if (ann.color === "red") colorVal = rgb(0.85, 0.18, 0.18);
                else if (ann.color === "blue") colorVal = rgb(0.18, 0.35, 0.85);

                page.drawText(ann.text, {
                    x: pdfX,
                    y: pdfY,
                    size: ann.fontSize * 0.75, // Adjust font scaling factor
                    font,
                    color: colorVal,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/i, "")}_annotated.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success("PDF saved and downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save PDF annotations.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your annotations are compiled locally in RAM. No file details are transmitted.</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Type className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Page Annotator</h2>
                        <p className="text-xs text-muted-foreground">Add text blocks, notes, and comments to PDF pages locally</p>
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
                    {file && (
                        <>
                            <Button 
                                variant={activeTool === "text" ? "secondary" : "outline"}
                                onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
                                className={`text-xs font-bold ${activeTool === "text" ? "bg-primary/15 text-primary border-primary/20" : "border-border"}`}
                            >
                                <Type className="mr-2 h-4 w-4" /> Click to Add Text
                            </Button>
                            <Button 
                                disabled={isProcessing}
                                onClick={savePDF}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Saving...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Save PDF</>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Editor Workspace Area */}
                <div className="lg:col-span-3 space-y-4">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Type className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload PDF to Add Text</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a PDF document, select "Click to Add Text" tool, and tap anywhere on the page to insert custom annotations.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pagination controls */}
                            <div className="flex items-center justify-between p-4 bg-muted/10 border border-border/30 rounded-2xl text-xs">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-foreground truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="w-7 h-7 border-border hover:bg-muted"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="font-bold uppercase tracking-wider text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="w-7 h-7 border-border hover:bg-muted"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Main Interactive Canvas Viewer wrapper */}
                            <div 
                                onClick={handleCanvasClick}
                                className={`relative border border-border/40 rounded-3xl bg-white shadow-md overflow-hidden max-w-full flex justify-center p-4 select-none ${activeTool === "text" ? "cursor-crosshair" : "cursor-default"}`}
                            >
                                <div className="relative">
                                    <canvas ref={canvasRef} className="max-w-full h-auto bg-white border border-border/10 shadow-sm" />
                                    
                                    {/* HTML Annotation overlays inside viewport space */}
                                    {canvasRef.current && annotations.filter(a => a.page === currentPage).map((ann) => {
                                        const isEditing = editingAnnotationId === ann.id;
                                        return (
                                            <div
                                                key={ann.id}
                                                style={{ 
                                                    position: "absolute",
                                                    left: `${(ann.x / canvasRef.current!.width) * 100}%`,
                                                    top: `${(ann.y / canvasRef.current!.height) * 100}%`,
                                                    transform: "translate(-50%, -50%)",
                                                }}
                                                className={`absolute z-30 group p-1.5 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all text-xs font-bold leading-none ${ann.color === "red" ? "text-red-500" : ann.color === "blue" ? "text-blue-500" : "text-black"}`}
                                            >
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={ann.text}
                                                        onChange={(e) => updateAnnotationText(ann.id, e.target.value)}
                                                        onBlur={() => setEditingAnnotationId(null)}
                                                        autoFocus
                                                        className="px-1.5 py-0.5 border border-primary bg-white text-black rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                ) : (
                                                    <span 
                                                        onDoubleClick={() => setEditingAnnotationId(ann.id)}
                                                        style={{ fontSize: `${ann.fontSize * 0.7}px` }}
                                                        className="cursor-text"
                                                    >
                                                        {ann.text}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteAnnotation(ann.id);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px]"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Controls Area */}
                {file && (
                    <div className="space-y-4">
                        <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5" /> Options
                            </h4>
                            <div className="space-y-4 text-xs">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Ink Color</Label>
                                    <div className="flex gap-2">
                                        {[
                                            { id: "black", label: "Black", bg: "bg-black" },
                                            { id: "blue", label: "Blue", bg: "bg-blue-600" },
                                            { id: "red", label: "Red", bg: "bg-red-600" }
                                        ].map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setSelectedColor(c.id)}
                                                className={`flex-1 flex items-center justify-center h-8 rounded-lg border text-[10px] font-bold gap-1 transition-all ${selectedColor === c.id ? "bg-primary border-primary text-primary-foreground shadow" : "border-border hover:bg-muted"}`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${c.bg} border border-white/20`} />
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="font-size" className="text-[10px] font-bold text-muted-foreground uppercase">Font Size (px)</Label>
                                    <Input
                                        id="font-size"
                                        type="number"
                                        min="10"
                                        max="60"
                                        value={selectedFontSize}
                                        onChange={(e) => setSelectedFontSize(Math.max(10, Math.min(60, parseInt(e.target.value, 10) || 14)))}
                                        className="h-8 text-xs border-border/30 bg-background/50 text-center font-bold"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Annotations List */}
                        {annotations.length > 0 && (
                            <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-3">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Annotations ({annotations.length})</h4>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {annotations.map((ann) => (
                                        <div key={ann.id} className="flex items-center justify-between p-2 border border-border/20 rounded-xl bg-background/40 text-xs">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="font-bold truncate text-foreground leading-normal">{ann.text}</p>
                                                <p className="text-[9px] text-muted-foreground font-semibold">Page {ann.page} — Size {ann.fontSize}px</p>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => deleteAnnotation(ann.id)}
                                                className="w-7 h-7 text-destructive hover:bg-destructive/10 shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
