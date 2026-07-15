"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Copy, 
    ImageIcon,
    ShieldCheck,
    Check,
    FileText,
    Settings,
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ImageToBase64Tool() {
    const [file, setFile] = useState<File | null>(null);
    const [base64, setBase64] = useState<string>("");
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setBase64("");
            setCopiedFormat(null);

            const reader = new FileReader();
            reader.onload = () => {
                setBase64(reader.result as string);
                toast.success("Image converted to Base64 string successfully.");
            };
            reader.readAsDataURL(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid image file");
        }
        e.target.value = "";
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getSnippet = (format: string) => {
        if (!base64) return "";
        switch (format) {
            case "raw":
                return base64.split(",")[1] || base64;
            case "datauri":
                return base64;
            case "html":
                return `<img src="${base64}" alt="Base64 Image" />`;
            case "css":
                return `background-image: url("${base64}");`;
            default:
                return base64;
        }
    };

    const copySnippet = (format: string) => {
        const text = getSnippet(format);
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 1500);
        toast.success(`Copied ${format.toUpperCase()} snippet!`);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Base64 encoding is performed entirely inside browser memory. Your image never leaves your device.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Code className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image to Base64 Encoder</h2>
                        <p className="text-xs text-muted-foreground">Convert images into standard Base64 data URIs, HTML image tags, or CSS attributes locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Upload className="mr-2 h-4 w-4" /> {file ? "Change Image" : "Select Image"}
                    </Button>
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={onFileChange}
                />
            </div>

            {/* Main Content & Formats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <ImageIcon className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Image to Encode</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Upload a PNG, JPG, WebP, or SVG. We encode it locally to produce copy-paste ready data representations.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Card className="border border-border/40 bg-white overflow-hidden shadow-lg rounded-3xl">
                                <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2 text-foreground">
                                        <ImageIcon className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-wider truncate max-w-xs">{file.name}</span>
                                    </div>
                                    <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Base64 Encoded</Badge>
                                </div>
                                <div className="p-8 flex items-center justify-center bg-muted/5 min-h-[220px]">
                                    {base64 && (
                                        <img 
                                            src={base64} 
                                            alt="Preview" 
                                            className="max-h-[200px] object-contain rounded-xl border shadow" 
                                        />
                                    )}
                                </div>
                            </Card>

                            {/* Snippets Area */}
                            {base64 && (
                                <div className="space-y-4">
                                    {[
                                        { id: "datauri", label: "Data URI (Source URL)" },
                                        { id: "raw", label: "Raw Base64 String" },
                                        { id: "html", label: "HTML Image Tag" },
                                        { id: "css", label: "CSS Background-Image" }
                                    ].map((fmt) => (
                                        <div key={fmt.id} className="space-y-1.5">
                                            <div className="flex justify-between items-center px-1">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">{fmt.label}</Label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => copySnippet(fmt.id)}
                                                    className="h-7 text-[10px] font-bold gap-1 px-2.5 rounded-lg border hover:bg-muted"
                                                >
                                                    {copiedFormat === fmt.id ? (
                                                        <><Check className="w-3 h-3 text-emerald-500" /> Copied</>
                                                    ) : (
                                                        <><Copy className="w-3 h-3 text-primary" /> Copy</>
                                                    )}
                                                </Button>
                                            </div>
                                            <Textarea 
                                                readOnly 
                                                value={getSnippet(fmt.id)} 
                                                className="font-mono text-xs leading-normal bg-background/50 h-20 resize-none border-border/30 rounded-xl" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side Stats Panel */}
                <div className="space-y-4">
                    {file && (
                        <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-primary" /> Properties
                            </h4>
                            
                            <div className="space-y-2 text-muted-foreground">
                                <div className="flex justify-between py-1 border-b border-border/10">
                                    <span>File size:</span>
                                    <span className="font-bold text-foreground">{formatSize(file.size)}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/10">
                                    <span>Format:</span>
                                    <span className="font-bold text-foreground uppercase">{file.type.split("/")[1] || "Image"}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>String length:</span>
                                    <span className="font-bold text-foreground font-mono">{base64.length.toLocaleString()} chars</span>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl space-y-4 text-xs leading-relaxed">
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <Settings className="w-4 h-4 text-primary" /> Use cases
                        </h4>
                        <p className="text-muted-foreground">
                            Use Base64 data URIs to inline small icons and vector assets directly in HTML templates or CSS stylesheets, reducing HTTP network overhead.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
