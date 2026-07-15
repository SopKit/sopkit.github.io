"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Lock, 
    FileText,
    Loader2,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function PDFProtect() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissions, setPermissions] = useState({
        printing: true,
        modifying: false,
        copying: false,
        annotating: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
            setFile(selectedFile);
            toast.success("PDF loaded successfully");
        } else if (selectedFile) {
            toast.error("Please select a valid PDF file");
        }
    }, []);

    const protectPDF = async () => {
        if (!file) {
            toast.error("Please upload a PDF file first");
            return;
        }
        if (!password) {
            toast.error("Please enter a password");
            return;
        }

        setIsProcessing(true);
        try {
            const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
            const arrayBuffer = await file.arrayBuffer();
            const existingPdfBytes = new Uint8Array(arrayBuffer);

            // Encrypt using the library with options
            const ownerPassword = Math.random().toString(36).substring(7);
            const encryptedBytes = await encryptPDF(existingPdfBytes, password, {
                ownerPassword,
                allowPrinting: permissions.printing,
                allowCopying: permissions.copying,
                allowModifying: permissions.modifying,
                allowAnnotating: permissions.annotating,
            });

            const blob = new Blob([encryptedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name.replace(/\.pdf$/i, "")}_protected.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success("PDF protected successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to protect PDF. The file might already be encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Shield */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your documents are encrypted locally. No bytes are sent to any remote server.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">PDF Protector</h2>
                        <p className="text-xs text-muted-foreground">Secure your PDF documents with local password protection</p>
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
                        onClick={protectPDF}
                        className="bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Securing...</>
                        ) : (
                            <><ShieldCheck className="mr-2 h-4 w-4" /> Protect PDF</>
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
                            <h3 className="mt-6 text-lg font-bold">Upload PDF to Secure</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Add a strong password to your PDF and restrict unauthorized access, printing, or copying locally.
                            </p>
                        </div>
                    ) : (
                        <Card className="border-border/40 bg-card/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
                            <div className="p-8 flex flex-col items-center justify-center bg-muted/20 border-b border-border/20">
                                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                                    <FileText className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-base font-bold truncate max-w-xs">{file.name}</h3>
                                <div className="mt-3 flex gap-2">
                                    <Badge variant="secondary" className="text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                                    <Badge variant="outline" className="border-primary/20 text-primary text-xs">Ready to Secure</Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password-input" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Set Access Password</Label>
                                            <div className="relative">
                                                <Input 
                                                    id="password-input"
                                                    type={showPassword ? "text" : "password"} 
                                                    placeholder="Enter a strong password..." 
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
                                            <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                                                This password will be required to open the protected PDF document.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Restrict Permissions</Label>
                                        <div className="space-y-3 pl-1">
                                            {[
                                                { id: "printing", label: "Allow Printing" },
                                                { id: "copying", label: "Allow Copying Text/Images" },
                                                { id: "modifying", label: "Allow Modifying Content" },
                                                { id: "annotating", label: "Allow Form Filling & Annotations" }
                                            ].map((perm) => (
                                                <div key={perm.id} className="flex items-center space-x-2.5">
                                                    <Checkbox 
                                                        id={perm.id} 
                                                        checked={(permissions as any)[perm.id]}
                                                        onCheckedChange={(checked) => 
                                                            setPermissions(prev => ({ ...prev, [perm.id]: !!checked }))
                                                        }
                                                        className="border-border/60 data-[state=checked]:bg-primary"
                                                    />
                                                    <Label htmlFor={perm.id} className="text-xs font-medium text-foreground cursor-pointer select-none">
                                                        {perm.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Side Info Bar */}
                <div className="space-y-4">
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">Security Features</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• <strong>Local RC4 128-bit Encryption</strong> protects user access.</li>
                            <li>• Custom file permission flags to restrict modifications.</li>
                            <li>• Zero server retention: your files are processed in-browser.</li>
                        </ul>
                    </Card>
                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-3 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground">HIPAA & SOC2 Safe</h4>
                        <p className="text-muted-foreground">
                            Because no documents are sent to any remote servers, this tool is ideal for corporate and institutional security standards.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
