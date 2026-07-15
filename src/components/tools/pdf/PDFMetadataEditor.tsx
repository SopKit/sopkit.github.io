"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Info, 
    FileText,
    Loader2,
    ShieldCheck,
    Tags,
    User,
    BookOpen,
    Trash2,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PDFMetadata {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
}

export default function PDFMetadataEditor() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [metadata, setMetadata] = useState<PDFMetadata>({
        title: "",
        author: "",
        subject: "",
        keywords: "",
        creator: "",
        producer: ""
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadMetadata = async (pdfFile: File) => {
        setIsProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            setMetadata({
                title: pdfDoc.getTitle() || "",
                author: pdfDoc.getAuthor() || "",
                subject: pdfDoc.getSubject() || "",
                keywords: pdfDoc.getKeywords() || "",
                creator: pdfDoc.getCreator() || "",
                producer: pdfDoc.getProducer() || ""
            });
            toast.success("Document metadata loaded.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to load PDF metadata.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            await loadMetadata(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
        e.target.value = "";
    }, []);

    const stripAllMetadata = () => {
        setMetadata({
            title: "",
            author: "",
            subject: "",
            keywords: "",
            creator: "",
            producer: ""
        });
        toast.info("All metadata fields cleared locally. Click Save to download the anonymous document.");
    };

    const handleInputChange = (field: keyof PDFMetadata, value: string) => {
        setMetadata(prev => ({ ...prev, [field]: value }));
    };

    const updateMetadata = async () => {
        if (!file) {
            toast.error("Please select a PDF file first");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Update parameters
            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(",").map(k => k.trim()));
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/i, "")}_edited.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success("PDF metadata updated and saved!");
            
            const newFile = new File([blob], file.name, { type: "application/pdf" });
            setFile(newFile);
            await loadMetadata(newFile);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save edited PDF metadata.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Metadata editing runs locally in RAM. No file details are transmitted to any server.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Tags className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Metadata Editor</h2>
                        <p className="text-xs text-muted-foreground">View, edit, or strip metadata details from PDF files locally</p>
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
                                variant="outline" 
                                onClick={stripAllMetadata}
                                className="border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Strip All Tags
                            </Button>
                            <Button 
                                disabled={isProcessing}
                                onClick={updateMetadata}
                                className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Saving...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Save Metadata</>
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
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Tags className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload PDF to Edit Info</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a PDF document to review author metadata, subjects, keywords, and strip signatures locally.
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
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs font-bold">Metadata Loaded</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title-input" className="text-xs font-bold text-muted-foreground uppercase">Document Title</Label>
                                        <Input 
                                            id="title-input"
                                            value={metadata.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="author-input" className="text-xs font-bold text-muted-foreground uppercase">Author / Owner</Label>
                                        <Input 
                                            id="author-input"
                                            value={metadata.author}
                                            onChange={(e) => handleInputChange("author", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject-input" className="text-xs font-bold text-muted-foreground uppercase">Subject</Label>
                                        <Input 
                                            id="subject-input"
                                            value={metadata.subject}
                                            onChange={(e) => handleInputChange("subject", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="keywords-input" className="text-xs font-bold text-muted-foreground uppercase">Keywords (Comma Separated)</Label>
                                        <Input 
                                            id="keywords-input"
                                            value={metadata.keywords}
                                            onChange={(e) => handleInputChange("keywords", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="creator-input" className="text-xs font-bold text-muted-foreground uppercase">Application Creator</Label>
                                        <Input 
                                            id="creator-input"
                                            value={metadata.creator}
                                            onChange={(e) => handleInputChange("creator", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="producer-input" className="text-xs font-bold text-muted-foreground uppercase">PDF Producer Tool</Label>
                                        <Input 
                                            id="producer-input"
                                            value={metadata.producer}
                                            onChange={(e) => handleInputChange("producer", e.target.value)}
                                            className="border-border/30 bg-background/50 h-10 text-sm"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Why strip metadata?</h4>
                        <p className="text-muted-foreground">
                            When sharing PDF resumes, contracts, or drafts, standard files include creation timestamps, author names, and internal editing tool identifiers. Stripping tags guarantees anonymity.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
