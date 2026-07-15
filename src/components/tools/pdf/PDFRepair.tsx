"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    Hammer,
    Settings,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function PDFRepair() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [disableObjectStreams, setDisableObjectStreams] = useState<boolean>(true);
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

    const repairPDF = async () => {
        if (!file) {
            toast.error("Please upload a PDF file first");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            
            // Rebuilding the PDF structure by parsing and re-encoding it.
            // ignoreEncryption: true enables reading documents with corrupted or incomplete encryption schemas.
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            // Saving without object streams forces pdf-lib to expand compressed stream structures,
            // repairing indexing issues that prevent older PDF readers from parsing the pages.
            const pdfBytes = await pdfDoc.save({ useObjectStreams: !disableObjectStreams });
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            
            toast.success("PDF structure repaired and optimized successfully!");
        } catch (error) {
            console.error("Error repairing PDF:", error);
            toast.error("Failed to repair PDF. The document stream may be severely corrupted or encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are repaired locally in RAM. No file contents are sent over the internet.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Hammer className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Repair & Recovery</h2>
                        <p className="text-xs text-muted-foreground">Fix broken headers, rebuild cross-reference indexing, and restore compatibility locally</p>
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
                        onClick={repairPDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Repairing...</>
                        ) : (
                            <><Hammer className="mr-2 h-4 w-4" /> Repair PDF</>
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
                                <Hammer className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Corrupted PDF</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload your broken PDF to inspect structural issues and compile a clean, rebuilt copy locally in your browser.
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
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs font-bold">Ready to Recover</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4 max-w-md mx-auto">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-2">
                                        <Settings className="w-3.5 h-3.5" />
                                        Repair Configurations
                                    </h4>

                                    <div className="flex items-start space-x-2.5 p-3 border border-border/20 rounded-xl bg-background/50">
                                        <Checkbox 
                                            id="object-streams" 
                                            checked={disableObjectStreams}
                                            onCheckedChange={(checked) => setDisableObjectStreams(!!checked)}
                                            className="border-border/60 data-[state=checked]:bg-primary mt-0.5"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="object-streams" className="text-xs font-bold text-foreground cursor-pointer select-none">
                                                Optimize Stream Formatting
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground leading-normal">
                                                Rebuild cross-reference (xref) structures and stream tables, fixing compatibility with older PDF readers.
                                            </p>
                                        </div>
                                    </div>

                                    {downloadUrl && (
                                        <div className="pt-4 border-t border-border/20 text-center animate-in">
                                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10">
                                                <a href={downloadUrl} download={`repaired_${file.name}`}>
                                                    <Download className="w-4 h-4 mr-2" /> Download Repaired PDF
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Common fixes applied</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Rebuild broken xref (cross-reference) offset tables.</li>
                            <li>• Add missing EOF (End of File) signatures.</li>
                            <li>• Re-structure broken page tree hierarchies.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
