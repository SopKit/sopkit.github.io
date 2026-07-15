"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Unlock, 
    FileText,
    Loader2,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PDFUnlock() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            setIsDecrypted(false);
            setDownloadUrl(null);
            setPassword("");
            toast.success("PDF loaded successfully");
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
    }, []);

    const unlockPDF = async () => {
        if (!file) {
            toast.error("Please upload a PDF file first");
            return;
        }
        if (!password) {
            toast.error("Please enter the PDF password");
            return;
        }

        setIsProcessing(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const arrayBuffer = await file.arrayBuffer();
            
            // pdf-lib decrypts the PDF document in memory using the user password
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
            const pdfBytes = await pdfDoc.save();
            
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setIsDecrypted(true);
            toast.success("PDF password removed successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to unlock PDF. The password might be incorrect.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Shield */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are decrypted locally in RAM. No file data leaves your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Unlock className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Unlocker</h2>
                        <p className="text-xs text-muted-foreground">Remove passwords and security restrictions from your PDFs locally</p>
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
                        disabled={!file || !password || isProcessing}
                        onClick={unlockPDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Removing Restrictions...</>
                        ) : (
                            <><Unlock className="mr-2 h-4 w-4" /> Unlock PDF</>
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
                            <h3 className="mt-6 text-lg font-bold">Upload Locked PDF</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload your password-protected PDF to strip access restrictions and create an unlocked copy.
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
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs">Ready to Decrypt</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4 max-w-sm mx-auto">
                                    <div className="space-y-2">
                                        <Label htmlFor="password-input" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enter Document Password</Label>
                                        <div className="relative">
                                            <Input 
                                                id="password-input"
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="Enter PDF password..." 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pr-10 border-border/30 focus-visible:ring-primary/20 bg-background/50 h-10"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {isDecrypted && downloadUrl && (
                                        <div className="pt-4 space-y-3 border-t border-border/20 text-center animate-in">
                                            <div className="flex items-center justify-center gap-1.5 text-emerald-500 text-sm font-semibold">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                <span>Restrictions Removed Successfully!</span>
                                            </div>
                                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10">
                                                <a href={downloadUrl} download={`${file.name.replace(/\.pdf$/i, "")}_unlocked.pdf`}>
                                                    Download Unlocked PDF
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
                        <h4 className="font-bold text-sm text-foreground">How unlocking works</h4>
                        <p className="text-muted-foreground">
                            Standard security protocols require entering the password. Once loaded, our local javascript environment removes the encryption flag and saves an unencrypted copy.
                        </p>
                    </Card>
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-3 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">No Password bypass</h4>
                        <p className="text-muted-foreground">
                            For security reasons, this tool does not crack password keys. You must know the password to strip restrictions.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
