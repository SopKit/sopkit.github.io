"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Settings,
    Hash,
    Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PDFPageNumbers() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [position, setPosition] = useState<string>("bottom-center");
    const [startFrom, setStartFrom] = useState<number>(1);
    const [fontSize, setFontSize] = useState<number>(10);
    const [textFormat, setTextFormat] = useState<string>("Page {page} of {total}");
    const [textColor, setTextColor] = useState<string>("black");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setDownloadUrl(null);
            toast.success("PDF loaded successfully");
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const addPageNumbers = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const total = pages.length;
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Determine RGB color
            let colorVal = rgb(0, 0, 0); // default black
            if (textColor === "gray") colorVal = rgb(0.5, 0.5, 0.5);
            else if (textColor === "white") colorVal = rgb(1, 1, 1);
            else if (textColor === "red") colorVal = rgb(0.85, 0.18, 0.18);
            else if (textColor === "blue") colorVal = rgb(0.18, 0.35, 0.85);

            for (let i = 0; i < total; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                
                // Build string
                const pageNum = i + startFrom;
                const text = textFormat
                    .replace("{page}", String(pageNum))
                    .replace("{total}", String(total));

                const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                
                let x = width / 2 - textWidth / 2; // default center
                let y = 25; // default bottom

                const [vPos, hPos] = position.split("-");
                
                if (hPos === "left") x = 40;
                else if (hPos === "right") x = width - textWidth - 40;
                
                if (vPos === "top") y = height - fontSize - 25;

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font: helveticaFont,
                    color: colorVal,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("Page numbers added successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add page numbers to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Page numbering runs locally. Your document stays on your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Hash className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Add PDF Page Numbers</h2>
                        <p className="text-xs text-muted-foreground">Add custom layout numbers and headers/footers to PDF pages</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change PDF" : "Select PDF"}
                    </Button>
                    <Button 
                        disabled={!file || isProcessing}
                        onClick={addPageNumbers}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Numbering...</>
                        ) : (
                            <><Hash className="mr-2 h-4 w-4" /> Add Page Numbers</>
                        )}
                    </Button>
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
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Hash className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload PDF to Number</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload your document to add headers, page counters, and margins locally in your browser.
                            </p>
                        </div>
                    ) : (
                        <Card className="border-border/40 bg-card/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg animate-in">
                            <div className="p-8 flex flex-col items-center justify-center bg-muted/20 border-b border-border/20">
                                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                                    <FileText className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-base font-bold truncate max-w-xs">{file.name}</h3>
                                <div className="mt-3 flex gap-2">
                                    <Badge variant="secondary" className="text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs">Ready to Number</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                            <Settings className="w-3.5 h-3.5" />
                                            Layout Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="position-select" className="text-xs font-semibold text-foreground">Position</Label>
                                                <select
                                                    id="position-select"
                                                    value={position}
                                                    onChange={(e) => setPosition(e.target.value)}
                                                    className="w-full h-10 px-3 rounded-lg border border-border/35 bg-background text-sm focus-visible:ring-primary/20"
                                                >
                                                    <option value="top-left">Top Left</option>
                                                    <option value="top-center">Top Center</option>
                                                    <option value="top-right">Top Right</option>
                                                    <option value="bottom-left">Bottom Left</option>
                                                    <option value="bottom-center">Bottom Center</option>
                                                    <option value="bottom-right">Bottom Right</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="start-input" className="text-xs font-semibold text-foreground">Start Numbering From</Label>
                                                <Input 
                                                    id="start-input"
                                                    type="number"
                                                    min="1"
                                                    value={startFrom}
                                                    onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                                    className="border-border/30 bg-background/50 h-10 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                            <Type className="w-3.5 h-3.5" />
                                            Font & Text Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="format-input" className="text-xs font-semibold text-foreground">Number Format</Label>
                                                <Input 
                                                    id="format-input"
                                                    type="text"
                                                    value={textFormat}
                                                    onChange={(e) => setTextFormat(e.target.value)}
                                                    className="border-border/30 bg-background/50 h-10 text-sm"
                                                />
                                                <p className="text-[9px] text-muted-foreground leading-normal mt-1">
                                                    Use <span className="font-mono">{`{page}`}</span> for current page and <span className="font-mono">{`{total}`}</span> for total count.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="color-select" className="text-xs font-semibold text-foreground">Color</Label>
                                                    <select
                                                        id="color-select"
                                                        value={textColor}
                                                        onChange={(e) => setTextColor(e.target.value)}
                                                        className="w-full h-10 px-3 rounded-lg border border-border/35 bg-background text-sm focus-visible:ring-primary/20"
                                                    >
                                                        <option value="black">Black</option>
                                                        <option value="gray">Gray</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="red">Red</option>
                                                        <option value="white">White</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="size-input" className="text-xs font-semibold text-foreground">Font Size (pt)</Label>
                                                    <Input 
                                                        id="size-input"
                                                        type="number"
                                                        min="6"
                                                        max="28"
                                                        value={fontSize}
                                                        onChange={(e) => setFontSize(Math.max(6, Math.min(28, parseInt(e.target.value, 10) || 10)))}
                                                        className="border-border/30 bg-background/50 h-10 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {downloadUrl && (
                                    <div className="pt-6 border-t border-border/20 text-center animate-in">
                                        <Button asChild className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10">
                                            <a href={downloadUrl} download={`${file.name.replace(/\.pdf$/i, "")}_numbered.pdf`}>
                                                <Download className="w-4 h-4 mr-2" /> Download Numbered PDF
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Custom Templates</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Use <span className="font-mono">Page {"{page}"} of {"{total}"}</span> for standard formats.</li>
                            <li>• Use <span className="font-mono">Doc-ID: {"{page}"}</span> for archive structures.</li>
                            <li>• Custom color settings support light and dark print styles.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
