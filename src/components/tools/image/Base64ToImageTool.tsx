"use client";

import { useState, useCallback } from "react";
import { 
    Download, 
    Image as ImageIcon, 
    Loader2,
    ShieldCheck,
    Check,
    Code,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Base64ToImageTool() {
    const [base64, setBase64] = useState<string>("");
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageType, setImageType] = useState<string>("png");

    const handleDecode = () => {
        if (!base64.trim()) return;
        
        setIsProcessing(true);
        try {
            let src = base64.trim();
            // If prefix is missing, auto-prepend default PNG prefix
            if (!src.startsWith("data:image/")) {
                src = `data:image/png;base64,${src}`;
                setImageType("png");
            } else {
                // Parse out mime type
                const match = src.match(/^data:(image\/[a-zA-Z+]+);base64,/);
                if (match && match[1]) {
                    setImageType(match[1].split("/")[1] || "png");
                }
            }
            
            // Validate image load
            const img = new Image();
            img.onload = () => {
                setPreview(src);
                setIsProcessing(false);
                toast.success("Base64 string decoded to image successfully!");
            };
            img.onerror = () => {
                setIsProcessing(false);
                toast.error("Failed to decode. Invalid Base64 data format.");
                setPreview(null);
            };
            img.src = src;
        } catch (error) {
            setIsProcessing(false);
            toast.error("Failed to parse Base64 string.");
            setPreview(null);
        }
    };

    const downloadImage = () => {
        if (!preview) return;
        const link = document.createElement("a");
        link.href = preview;
        link.download = `decoded_image_${Date.now()}.${imageType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Sanitized image downloaded!");
    };

    const clearAll = () => {
        setBase64("");
        setPreview(null);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your strings are converted to pixels locally inside your browser memory. We never sell your data or upload it.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Base64 to Image Decoder</h2>
                        <p className="text-xs text-muted-foreground">Decode standard Base64 string representations or Data URIs back to clean images locally</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                        variant="outline" 
                        onClick={clearAll}
                        className="border-border hover:bg-muted/40 text-xs font-bold"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All
                    </Button>
                    <Button 
                        disabled={!base64.trim() || isProcessing}
                        onClick={handleDecode}
                        className="bg-primary hover:bg-primary/95 text-xs font-bold text-white shadow-md shadow-primary/10"
                    >
                        {isProcessing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Decoding...</>
                        ) : (
                            <><Check className="mr-2 h-4 w-4" /> Decode Base64</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Text Area Input */}
                <div className="space-y-4">
                    <Label htmlFor="base64-input" className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5" /> Base64 / Data URI Input
                    </Label>
                    <Textarea 
                        id="base64-input"
                        value={base64}
                        onChange={(e) => {
                            setBase64(e.target.value);
                            setPreview(null);
                        }}
                        className="font-mono text-xs leading-relaxed border-border/30 bg-background/50 h-[320px] resize-none focus-visible:ring-primary/20 rounded-2xl p-4"
                        placeholder="Paste base64 code here (e.g. data:image/png;base64,iVBORw0KGgo...)"
                    />
                </div>

                {/* Preview Output */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /> Rendered Output
                        </Label>
                        {preview && (
                            <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-bold uppercase">
                                Format: {imageType}
                            </Badge>
                        )}
                    </div>
                    
                    <Card className="border border-border/40 rounded-2xl overflow-hidden shadow-lg h-[320px] flex flex-col bg-muted/5">
                        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
                            {preview ? (
                                <img 
                                    src={preview} 
                                    alt="Decoded result" 
                                    className="max-h-[220px] object-contain rounded-xl border shadow" 
                                />
                            ) : (
                                <div className="text-center text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">
                                    Your decoded image will be rendered here. Tap "Decode Base64" after pasting code.
                                </div>
                            )}
                        </div>
                        {preview && (
                            <div className="p-4 border-t border-border/20 bg-background/40 flex justify-center">
                                <Button onClick={downloadImage} className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                                    <Download className="w-4 h-4 mr-2" /> Download Decoded Image
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
