"use client";

import { useState, useRef } from "react";
import { 
    Download, 
    Loader2,
    ShieldCheck,
    Code,
    Eye,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HTMLToPDF() {
    const [html, setHtml] = useState<string>("<h1>Hello World</h1>\n<p>This is a sample HTML document that will be converted to PDF locally in your browser.</p>\n<div style='background: #f1f5f9; padding: 20px; border-radius: 12px; margin-top: 15px;'>\n  <h2 style='color: #3b82f6;'>Interactive PDF Generation</h2>\n  <p>Everything runs client-side inside your browser sandbox.</p>\n</div>");
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!previewRef.current) return;

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

            const imgData = canvas.toDataURL("image/jpeg", 0.92);
            const pdfDoc = await PDFDocument.create();
            
            // Convert pixels to points (1 pixel = 0.75 points)
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
            
            toast.success("HTML layout converted to PDF successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF from HTML.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: HTML compilation runs locally. No data is sent to external servers.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Code className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">HTML to PDF Converter</h2>
                        <p className="text-xs text-muted-foreground">Compile custom HTML code strings or layouts into PDF documents locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        disabled={isProcessing || !html.trim()}
                        onClick={generatePDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Compiling...</>
                        ) : (
                            <><Download className="mr-2 h-4 w-4" /> Convert to PDF</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Area */}
                <div className="space-y-4">
                    <Label htmlFor="html-editor" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5" /> HTML Code Editor
                    </Label>
                    <Textarea 
                        id="html-editor"
                        value={html}
                        onChange={(e) => {
                            setHtml(e.target.value);
                            setDownloadUrl(null);
                        }}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[450px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Write your HTML here..."
                    />
                </div>

                {/* Preview Area */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Interactive Page Preview
                        </Label>
                        <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-bold uppercase">A4 Aspect</Badge>
                    </div>
                    
                    <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[450px] flex flex-col bg-white">
                        <div className="flex-1 overflow-y-auto p-8 select-none bg-white text-black">
                            <div 
                                ref={previewRef}
                                className="prose prose-sm max-w-none text-black html-pdf-preview"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </div>
                    </Card>
                </div>
            </div>

            {downloadUrl && (
                <div className="flex justify-center pt-2">
                    <Card className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl space-y-3 text-xs max-w-sm w-full text-center animate-in">
                        <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">PDF Ready!</h4>
                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10">
                            <a href={downloadUrl} download={`html_document_${Date.now()}.pdf`}>
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </a>
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}
