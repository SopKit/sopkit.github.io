"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { QrCode, Download, Settings, Palette, Type, Image as ImageIcon, Loader2 } from "lucide-react";
import { SITE_URL } from "@/constants/config";
import { loadQrCodeLibrary } from "@/lib/load-qrcode";

export default function QrGeneratorPremium({
    initialText = SITE_URL,
}: {
    initialText?: string;
}) {
    const [text, setText] = useState(initialText);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [margin, setMargin] = useState(4);
    const [size, setSize] = useState(256);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrcodeReady, setQrcodeReady] = useState(false);
    const [loadError, setLoadError] = useState("");
    const canvasRef = useRef<HTMLDivElement>(null);

    const generateQR = useCallback(async () => {
        if (!(window as any).QRCode) return;
        if (!text.trim()) return;
        setIsGenerating(true);
        try {
            const QRCode = (window as any).QRCode;
            const canvas = document.createElement("canvas");
            await QRCode.toCanvas(canvas, text, {
                width: size,
                margin: margin,
                color: {
                    dark: fgColor,
                    light: bgColor
                }
            });
            
            if (canvasRef.current) {
                canvasRef.current.innerHTML = "";
                canvasRef.current.appendChild(canvas);
                canvas.className = "max-w-full h-auto rounded-lg shadow-sm border border-border";
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate QR code");
        } finally {
            setIsGenerating(false);
        }
    }, [bgColor, fgColor, margin, size, text]);

    const loadLibrary = useCallback(async () => {
        setLoadError("");
        try {
            await loadQrCodeLibrary();
            setQrcodeReady(true);
        } catch (error) {
            console.error("Failed to load QR code library", error);
            setQrcodeReady(false);
            setLoadError("Could not load the QR engine. Check your connection or try again.");
        }
    }, []);

    useEffect(() => {
        void loadLibrary();
    }, [loadLibrary]);

    useEffect(() => {
        if (qrcodeReady && text) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            generateQR();
        }
    }, [generateQR, qrcodeReady, text]);

    const downloadQR = async (format: "png" | "svg") => {
        const canvas = canvasRef.current?.querySelector("canvas");
        if (!canvas) {
            toast.error("Generate a QR code first.");
            return;
        }

        const link = document.createElement("a");
        link.download = `qrcode-${Date.now()}.${format}`;

        if (format === "png") {
            link.href = canvas.toDataURL("image/png");
        } else {
            try {
                const QRCode = await loadQrCodeLibrary();
                const svg = await QRCode.toString(text, {
                    type: "svg",
                    width: size,
                    margin,
                    color: { dark: fgColor, light: bgColor },
                });
                link.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
                link.click();
                window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
                toast.success("Downloaded as SVG");
                return;
            } catch {
                toast.error("SVG export failed. Try PNG instead.");
                return;
            }
        }

        link.click();
        toast.success("Downloaded as PNG");
    };

    return (
        <div className="grid gap-6 md:grid-cols-[1fr,300px]">
            <Card className="border-2 shadow-xl bg-card/40 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="w-6 h-6 text-primary" />
                        Premium QR Code Generator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="content" className="gap-2">
                                <Type className="w-4 h-4" /> Content
                            </TabsTrigger>
                            <TabsTrigger value="style" className="gap-2">
                                <Palette className="w-4 h-4" /> Style
                            </TabsTrigger>
                            <TabsTrigger value="config" className="gap-2">
                                <Settings className="w-4 h-4" /> Config
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4">
                            <div className="space-y-2">
                                <Label>QR Content (URL, Text, or vCard)</Label>
                                <Input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter your URL or text here..."
                                    className="h-12 text-base"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Foreground Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="w-12 h-10 p-1 rounded-xl"
                                        />
                                        <Input
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="flex-1 font-mono uppercase"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-12 h-10 p-1 rounded-xl"
                                        />
                                        <Input
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-1 font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="config" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Size ({size}px)</Label>
                                    <Input
                                        type="number"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                        min={128}
                                        max={1024}
                                        step={64}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quiet Zone (Margin)</Label>
                                    <Input
                                        type="number"
                                        value={margin}
                                        onChange={(e) => setMargin(Number(e.target.value))}
                                        min={0}
                                        max={20}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => downloadQR("png")}
                            disabled={isGenerating}
                            variant="secondary"
                            className="flex-1 gap-2"
                        >
                            <Download className="w-4 h-4" /> PNG
                        </Button>
                        <Button
                            onClick={() => void downloadQR("svg")}
                            disabled={isGenerating}
                            variant="outline"
                            className="flex-1 gap-2 border-primary/20 hover:bg-primary/5"
                        >
                            <ImageIcon className="w-4 h-4" /> SVG
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4 items-center justify-center p-6 border rounded-2xl bg-card/20 border-dashed border-primary/20">
                <div ref={canvasRef} className="relative transition-all duration-500 transform hover:scale-105">
                    {!qrcodeReady && !loadError && (
                        <div className="w-48 h-48 bg-muted/50 rounded-xl flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-7 h-7 animate-spin text-primary/50" />
                            <span className="text-xs text-muted-foreground">Loading QR engine…</span>
                        </div>
                    )}
                    {loadError && (
                        <div className="w-full max-w-xs rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-3">
                            <p className="text-sm font-medium text-foreground">{loadError}</p>
                            <Button size="sm" variant="outline" onClick={() => void loadLibrary()}>Retry</Button>
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-bold text-center uppercase tracking-widest text-muted-foreground opacity-50">
                    Live Preview
                </p>
                <div className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded-lg">
                    Scannable with any smartphone camera
                </div>
            </div>
        </div>
    );
}
