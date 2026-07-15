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
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

export default function PDFToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState<string>("");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setExtractedText("");
            setDownloadUrl(null);
            toast.success("PDF document loaded successfully.");
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const convertToWord = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

            const docx = await import("docx");

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            const numPages = pdf.numPages;
            let fullText = "";
            const sections = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + "\n\n";
                
                // Create docx paragraphs for this page, converting string text to object text runs
                const paragraphs = textContent.items.map((item: any) => {
                    return new docx.Paragraph({
                        children: [new docx.TextRun({ text: item.str })],
                    });
                });

                sections.push({
                    properties: {},
                    children: paragraphs,
                });

                setProgress(Math.round((i / numPages) * 60));
            }

            setExtractedText(fullText.substring(0, 1500) + (fullText.length > 1500 ? "..." : ""));

            const doc = new docx.Document({
                sections: sections,
            });

            const blob = await docx.Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            
            setProgress(100);
            toast.success("PDF converted to Word document successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to convert PDF to Word document.");
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
                        <h2 className="text-xl font-bold">PDF to Word Converter</h2>
                        <p className="text-xs text-muted-foreground">Convert PDF files into editable Microsoft Word (.docx) documents locally</p>
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
                    <Button 
                        disabled={!file || isProcessing}
                        onClick={convertToWord}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Converting...</>
                        ) : (
                            <><FileCheck className="mr-2 h-4 w-4" /> Convert to Word</>
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
                                <FileText className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload PDF Document</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a PDF document. We extract text contents and build an editable `.docx` Word file locally in browser RAM.
                            </p>
                        </div>
                    ) : (
                        <Card className="border border-border/40 bg-white overflow-hidden min-h-[400px] shadow-lg rounded-3xl">
                            <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-foreground">
                                    <Eye className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider truncate max-w-xs">{file.name}</span>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Extracted Text Preview</Badge>
                            </div>
                            <div className="p-8 md:p-12 text-black bg-white select-none">
                                {extractedText ? (
                                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto pr-1">
                                        {extractedText}
                                    </pre>
                                ) : isProcessing ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                                        <p className="text-xs text-muted-foreground animate-pulse">Extracting text layers locally...</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-24 text-muted-foreground text-xs font-medium">
                                        Click "Convert to Word" above to extract content layers.
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Content fidelity</h4>
                        <p className="text-muted-foreground">
                            This tool extracts the text layer from your PDF document and outputs a styled DOCX page tree. Rotated text boxes or scanner images are not supported.
                        </p>
                    </Card>
                    
                    {downloadUrl && (
                        <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3 text-xs leading-relaxed animate-in">
                            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Word File Ready!</h4>
                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                                <a href={downloadUrl} download={`${file.name.replace(/\.pdf$/i, "")}.docx`}>
                                    <Download className="w-4 h-4 mr-2" /> Download DOCX
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
