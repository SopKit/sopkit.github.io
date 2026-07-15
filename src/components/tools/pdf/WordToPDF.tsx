"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Download, 
    FileText,
    Loader2,
    ShieldCheck,
    FileCheck,
    FileType,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function WordToPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const convertToHtml = async (docxFile: File) => {
        setIsProcessing(true);
        try {
            const mammoth = await import("mammoth");
            const arrayBuffer = await docxFile.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setPreviewHtml(result.value);
        } catch (error) {
            console.error(error);
            toast.error("Failed to read Word document structure.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.name.endsWith(".docx") || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            setFile(selectedFile);
            setDownloadUrl(null);
            setPreviewHtml("");
            toast.success("Word document loaded successfully.");
            await convertToHtml(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid .docx document file.");
        }
        e.target.value = "";
    }, []);

    const generatePDF = async () => {
        if (!previewRef.current || !file) return;

        setIsProcessing(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const { PDFDocument } = await import("pdf-lib");

            const canvas = await html2canvas(previewRef.current, {
                scale: 1.8,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.9);
            const pdfDoc = await PDFDocument.create();
            
            // Convert pixels to PDF points (1 pixel = 0.75 points)
            const width = (canvas.width * 0.75) / 1.8;
            const height = (canvas.height * 0.75) / 1.8;

            const page = pdfDoc.addPage([width, height]);
            const img = await pdfDoc.embedJpg(imgData);
            
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: width,
                height: height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("Word document converted to PDF successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert Word document to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are converted locally. No file contents are sent over the network.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <FileType className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Word to PDF Converter</h2>
                        <p className="text-xs text-muted-foreground">Convert DOCX documents to standard PDF files locally in your browser</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change Document" : "Select Word File"}
                    </Button>
                    <Button 
                        disabled={!file || isProcessing}
                        onClick={generatePDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Converting...</>
                        ) : (
                            <><FileCheck className="mr-2 h-4 w-4" /> Convert to PDF</>
                        )}
                    </Button>
                </div>
                <input 
                    type="file" 
                    accept=".docx" 
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
                                <FileText className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Word Document</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a `.docx` file. We parse the document structure in browser RAM to render page previews and export to PDF.
                            </p>
                        </div>
                    ) : (
                        <Card className="border border-border/40 bg-white overflow-hidden min-h-[500px] shadow-lg rounded-3xl">
                            <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-foreground">
                                    <Eye className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider truncate max-w-xs">{file.name}</span>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Local Preview</Badge>
                            </div>
                            <div className="p-8 md:p-12 text-black bg-white select-none">
                                <div 
                                    ref={previewRef}
                                    className="prose prose-sm max-w-none word-preview"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                />
                                {isProcessing && !previewHtml && (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                                        <p className="text-xs text-muted-foreground animate-pulse">Parsing Word file structure...</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Layout Fidelity</h4>
                        <p className="text-muted-foreground">
                            Mammoth focuses on translating paragraphs, headings, bullet lists, and standard tables from Word layouts into clean, semantic HTML formats, preserving content.
                        </p>
                    </Card>
                    
                    {downloadUrl && (
                        <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3 text-xs leading-relaxed animate-in">
                            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">PDF Ready!</h4>
                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                                <a href={downloadUrl} download={`${file.name.replace(/\.docx$/i, "")}.pdf`}>
                                    <Download className="w-4 h-4 mr-2" /> Download PDF
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
