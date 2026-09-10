"use client";

import React, { useState, useRef, Suspense } from "react";
import { Download, RefreshCw, Sliders, Check, AlertCircle, FileImage, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AdPlacement from "@/components/ads/AdPlacement";
import {
    ToolShell,
    ToolGrid,
    ToolGridMain,
    ToolGridSide,
    ToolPanel,
    ToolDropzone,
    ToolModeTabs,
    ToolField,
    ToolFileBar,
    ToolSectionTitle,
    ToolPrivacyNote,
    ToolPreviewFrame,
} from "@/components/tools/shared/design-system";

function ExamPhotoResizerInner({
    examName = "UPSC",
    presetWidth = 350,
    presetHeight = 350,
    presetUnit = "px", // "px", "cm", "inch"
    presetMinKb = 20,
    presetMaxKb = 300,
    showSignatureOption = true,
    disclaimer = "Always verify requirements with the official notification before submitting."
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const lang = searchParams?.get("lang") || "en";
    const isHindi = lang === "hi";

    const changeLanguage = (newLang) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (newLang === "en") {
            params.delete("lang");
        } else {
            params.set("lang", newLang);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const t = {
        photo: isHindi ? "पासपोर्ट फोटो (Photo)" : "Passport Photo",
        signature: isHindi ? "हस्ताक्षर (Signature)" : "Signature Spec",
        uploadTitle: isHindi ? "यहाँ क्लिक करें या अपनी इमेज ड्रैग करें" : "Click or drag your image here",
        uploadSub: isHindi ? "JPG, JPEG, PNG फॉर्मेट समर्थित हैं" : "Supports JPG, JPEG, PNG formats",
        originalFile: isHindi ? "फाइल" : "File",
        originalSize: isHindi ? "मूल साइज" : "Original Size",
        settingsTitle: isHindi ? "रीसाइज सेटिंग्स" : "Resize Settings",
        widthLabel: isHindi ? "चौड़ाई" : "Width",
        heightLabel: isHindi ? "ऊंचाई" : "Height",
        minKbLabel: isHindi ? "न्यूनतम साइज (KB)" : "Min Size (KB)",
        maxKbLabel: isHindi ? "अधिकतम साइज (KB)" : "Max Size (KB)",
        reprocess: isHindi ? "पुनः प्रोसेस करें" : "Reprocess",
        privateLabel: isHindi ? "ब्राउज़र-आधारित (100% सुरक्षित और निजी)" : "Browser-based (100% private)",
        previewTitle: isHindi ? "आउटपुट प्रीव्यू" : "Output Preview",
        previewSub: isHindi ? "रीसाइज और कंप्रेस किया हुआ आउटपुट देखने के लिए एक इमेज अपलोड करें।" : "Upload an image to view the resized and compressed output.",
        dimensions: isHindi ? "डाइमेंशन्स" : "Dimensions",
        fileSize: isHindi ? "फाइल साइज" : "File Size",
        compliant: isHindi ? "टारगेट नियमों के अनुरूप है" : "Compliant with target rules",
        mismatch: isHindi ? "साइज बेमेल है। आयाम कम करने का प्रयास करें।" : "Size mismatch. Try reducing dimensions.",
        download: isHindi ? "JPEG डाउनलोड करें" : "Download JPEG",
        processing: isHindi ? "प्रोसेस हो रहा है…" : "Processing…",
        disclaimerLabel: isHindi ? "अस्वीकरण (Disclaimer):" : "Disclaimer:",
        disclaimerText: isHindi ? "जमा करने से पहले हमेशा आधिकारिक अधिसूचना के साथ आवश्यकताओं की पुष्टि करें।" : disclaimer,
    };

    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [originalInfo, setOriginalInfo] = useState(null);
    
    // Resize settings — initialized from the exam preset table below so the
    // first render already shows correct values (no cascading effect updates).
    const [mode, setMode] = useState("photo"); // "photo" or "signature"
    const [width, setWidth] = useState(() => getExamPresets(examName, "photo", presetWidth, presetHeight, presetMinKb, presetMaxKb).width);
    const [height, setHeight] = useState(() => getExamPresets(examName, "photo", presetWidth, presetHeight, presetMinKb, presetMaxKb).height);
    const [unit, setUnit] = useState(presetUnit);
    const [minKb, setMinKb] = useState(() => getExamPresets(examName, "photo", presetWidth, presetHeight, presetMinKb, presetMaxKb).minKb);
    const [maxKb, setMaxKb] = useState(() => getExamPresets(examName, "photo", presetWidth, presetHeight, presetMinKb, presetMaxKb).maxKb);
    
    // Processing state
    const [processing, setProcessing] = useState(false);
    const [resizedUrl, setResizedUrl] = useState("");
    const [resizedSize, setResizedSize] = useState(0);
    const [resizedWidth, setResizedWidth] = useState(0);
    const [resizedHeight, setResizedHeight] = useState(0);

    const canvasRef = useRef(null);

    // Exam preset dimensions (px) and KB windows per mode. Unknown exams
    // fall back to the component props.
    function getExamPresets(exam: string, m: string, dw: number, dh: number, dmin: number, dmax: number) {
        const table: Record<string, { photo: number[]; signature: number[] }> = {
            UPSC: { photo: [350, 350, 20, 300], signature: [350, 350, 20, 300] },
            SSC: { photo: [350, 450, 20, 50], signature: [350, 200, 10, 20] },
            NEET: { photo: [480, 640, 10, 200], signature: [350, 150, 4, 30] },
            JEE: { photo: [350, 450, 10, 200], signature: [350, 150, 4, 30] },
            CUET: { photo: [350, 450, 10, 200], signature: [350, 150, 4, 30] },
            Railway: { photo: [350, 450, 20, 50], signature: [350, 150, 10, 20] },
        };
        const entry = table[exam];
        const values = entry ? (m === "photo" ? entry.photo : entry.signature) : [dw, dh, dmin, dmax];
        return { width: values[0], height: values[1], minKb: values[2], maxKb: values[3] };
    }

    // Apply presets synchronously with the mode switch (no effect needed).
    const handleModeChange = (nextMode: string) => {
        setMode(nextMode);
        const presets = getExamPresets(examName, nextMode, presetWidth, presetHeight, presetMinKb, presetMaxKb);
        setWidth(presets.width);
        setHeight(presets.height);
        setMinKb(presets.minKb);
        setMaxKb(presets.maxKb);
    };

    const handleFiles = (files: File[]) => {
        const file = files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }

        setOriginalInfo({
            name: file.name,
            sizeKb: (file.size / 1024).toFixed(1),
            type: file.type
        });

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result !== "string") return;
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setPreviewUrl(result);
                // Trigger auto-process
                setTimeout(() => processImage(img), 100);
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    };

    const processImage = (activeImage = image) => {
        if (!activeImage) return;
        setProcessing(true);
        setResizedUrl("");
        
        setTimeout(() => {
            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                
                // Set canvas size to the requested target dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Crop and Draw (aspect fill centered)
                const targetRatio = width / height;
                const imgRatio = activeImage.width / activeImage.height;
                
                let sourceX = 0;
                let sourceY = 0;
                let sourceWidth = activeImage.width;
                let sourceHeight = activeImage.height;
                
                if (imgRatio > targetRatio) {
                    // Image is wider than target
                    sourceWidth = activeImage.height * targetRatio;
                    sourceX = (activeImage.width - sourceWidth) / 2;
                } else if (imgRatio < targetRatio) {
                    // Image is taller than target
                    sourceHeight = activeImage.width / targetRatio;
                    sourceY = (activeImage.height - sourceHeight) / 2;
                }
                
                ctx.drawImage(
                    activeImage,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, width, height
                );
                
                // Iterative compression to match target KB constraints
                let quality = 0.9;
                let dataUrl = "";
                let sizeBytes = 0;
                let sizeKb = 0;
                let minQ = 0.01;
                let maxQ = 0.99;
                
                for (let i = 0; i < 12; i++) {
                    dataUrl = canvas.toDataURL("image/jpeg", quality);
                    // size estimation from base64
                    sizeBytes = Math.round((dataUrl.split(",")[1].length * 3) / 4);
                    sizeKb = sizeBytes / 1024;
                    
                    if (sizeKb > maxKb) {
                        maxQ = quality;
                        quality = (minQ + quality) / 2;
                    } else if (sizeKb < minKb && quality < 0.95) {
                        minQ = quality;
                        quality = (maxQ + quality) / 2;
                    } else {
                        break;
                    }
                }
                
                setResizedUrl(dataUrl);
                setResizedSize(Number(sizeKb.toFixed(1)));
                setResizedWidth(width);
                setResizedHeight(height);
                toast.success(isHindi ? "इमेज सफलतापूर्वक प्रोसेस हो गई!" : "Image successfully processed!");
            } catch (err) {
                console.error(err);
                toast.error(isHindi ? "इमेज प्रोसेस करने में विफल।" : "Failed to process the image.");
            } finally {
                setProcessing(false);
            }
        }, 100);
    };

    const handleDownload = () => {
        if (!resizedUrl) return;
        const link = document.createElement("a");
        const suffix = mode === "photo" ? "photo" : "signature";
        link.download = `${examName.toLowerCase()}_${suffix}_resized.jpg`;
        link.href = resizedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = () => {
        setImage(null);
        setPreviewUrl("");
        setResizedUrl("");
        setOriginalInfo(null);
    };

    return (
        <ToolShell>
            <ToolGrid>

                {/* Upload & Config panel */}
                <ToolGridMain>
                    <ToolPanel>
                            
                            {/* Language selection toggle */}
                            <div className="flex justify-end items-center gap-2 mb-2 text-xs border-b border-border/10 pb-2">
                                <span className="text-muted-foreground">Language / भाषा:</span>
                                <button
                                    type="button"
                                    onClick={() => changeLanguage("en")}
                                    className={`px-2 py-0.5 rounded-sm transition-all text-[11px] font-bold ${!isHindi ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    English
                                </button>
                                <span className="text-muted-foreground/30">|</span>
                                <button
                                    type="button"
                                    onClick={() => changeLanguage("hi")}
                                    className={`px-2 py-0.5 rounded-sm transition-all text-[11px] font-bold ${isHindi ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    हिन्दी (Hindi)
                                </button>
                            </div>

                            {/* Mode selection (Photo vs Signature) */}
                            {showSignatureOption && (
                                <ToolModeTabs
                                    tabs={[
                                        { value: "photo", label: t.photo },
                                        { value: "signature", label: t.signature },
                                    ]}
                                    value={mode}
                                    onChange={handleModeChange}
                                />
                            )}

                            {/* File Upload Zone */}
                            {!previewUrl ? (
                                <ToolDropzone
                                    title={t.uploadTitle}
                                    subtitle={t.uploadSub}
                                    accept="image/*"
                                    onFiles={handleFiles}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <ToolPreviewFrame>
                                        <img
                                            src={previewUrl}
                                            alt="Uploaded preview"
                                            className="max-h-[300px] mx-auto object-contain shadow-sm border border-border/20"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={handleClear}
                                            className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md"
                                            title={isHindi ? "इमेज हटाएं" : "Remove image"}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </ToolPreviewFrame>
                                    {originalInfo && (
                                        <ToolFileBar>
                                            <span>{t.originalFile}: <strong>{originalInfo.name}</strong></span>
                                            <span>{t.originalSize}: <strong>{originalInfo.sizeKb} KB</strong></span>
                                        </ToolFileBar>
                                    )}
                                </div>
                            )}

                            {/* Dimension Settings Panel */}
                            <div className="space-y-4 pt-4 border-t border-border/40">
                                <ToolSectionTitle icon={<Sliders className="h-4 w-4" />}>
                                    {t.settingsTitle}
                                </ToolSectionTitle>
                                <div className="grid grid-cols-2 gap-4">
                                    <ToolField
                                        fieldId="width"
                                        label={`${t.widthLabel} (${unit})`}
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                    />
                                    <ToolField
                                        fieldId="height"
                                        label={`${t.heightLabel} (${unit})`}
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <ToolField
                                        fieldId="minKb"
                                        label={t.minKbLabel}
                                        type="number"
                                        value={minKb}
                                        onChange={(e) => setMinKb(parseInt(e.target.value) || 0)}
                                    />
                                    <ToolField
                                        fieldId="maxKb"
                                        label={t.maxKbLabel}
                                        type="number"
                                        value={maxKb}
                                        onChange={(e) => setMaxKb(parseInt(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <ToolPrivacyNote>{t.privateLabel}</ToolPrivacyNote>
                                    {previewUrl && (
                                        <Button
                                            type="button"
                                            onClick={() => processImage()}
                                            disabled={processing || !width || !height}
                                            className="gap-2"
                                            size="sm"
                                        >
                                            {processing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                            {t.reprocess}
                                        </Button>
                                    )}
                                </div>
                            </div>
                    </ToolPanel>
                </ToolGridMain>

                {/* Resized Result Output panel */}
                <ToolGridSide>
                    <div className="shrink-0">
                        <AdPlacement placement="in-content" slug="ssc-photo-resizer" category="exam" />
                    </div>
                    <Card className="border-2 border-primary/10 bg-card/30 backdrop-blur-sm shadow-xl min-h-[300px] flex flex-col justify-between">
                        <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                            <div className="space-y-4 text-center">
                                <h3 className="text-xl font-bold border-b border-border/20 pb-2">{t.previewTitle}</h3>
                                
                                {processing && (
                                    <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                        <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                                        <p className="text-muted-foreground text-sm font-medium">{t.processing}</p>
                                    </div>
                                )}

                                {!processing && !resizedUrl && (
                                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border/40 rounded-xl p-6 bg-muted/5">
                                        <FileImage className="h-12 w-12 text-muted-foreground/40 mb-3" />
                                        <p className="text-sm text-muted-foreground">{t.previewSub}</p>
                                    </div>
                                )}

                                {!processing && resizedUrl && (
                                    <div className="space-y-4">
                                        <ToolPreviewFrame className="border-primary/20">
                                            <img
                                                src={resizedUrl}
                                                alt="Resized output"
                                                className="max-h-[260px] mx-auto object-contain border border-border/40 shadow-md"
                                                style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
                                            />
                                        </ToolPreviewFrame>
                                        <div className="grid grid-cols-2 gap-2 text-sm bg-primary/5 border border-primary/10 rounded-xl py-2 px-3 text-left">
                                            <div>
                                                <span className="text-xs text-muted-foreground block">{t.dimensions}</span>
                                                <span className="font-bold font-mono">{resizedWidth} x {resizedHeight} px</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground block">{t.fileSize}</span>
                                                <span className={`font-bold font-mono ${resizedSize > maxKb || resizedSize < minKb ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    {resizedSize} KB
                                                </span>
                                            </div>
                                        </div>
                                        {resizedSize <= maxKb && resizedSize >= minKb && (
                                            <div className="flex items-center gap-1.5 justify-center text-xs text-emerald-500 font-semibold bg-emerald-500/10 py-1.5 px-3 border border-emerald-500/20">
                                                <Check className="h-4 w-4" /> {t.compliant}
                                            </div>
                                        )}
                                        {(resizedSize > maxKb || resizedSize < minKb) && (
                                            <div className="flex items-center gap-1.5 justify-center text-xs text-red-500 font-semibold bg-red-500/10 py-1.5 px-3 border border-red-500/20">
                                                <AlertCircle className="h-4 w-4" /> {t.mismatch}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/20">
                                <Button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={!resizedUrl || processing}
                                    className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                                >
                                    <Download className="h-5 w-5" />
                                    {t.download}
                                </Button>
                                
                                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                                    <span className="font-bold text-red-500/80">{t.disclaimerLabel}</span> {t.disclaimerText}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </ToolGridSide>

            </ToolGrid>

            <canvas ref={canvasRef} className="hidden" />
        </ToolShell>
    );
}

export default function ExamPhotoResizer(props) {
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <ExamPhotoResizerInner {...props} />
        </Suspense>
    );
}
