"use client";

import { useState, useCallback, useRef } from "react";
import { 
    Upload, 
    Image as ImageIcon,
    Loader2,
    ShieldCheck,
    Camera,
    MapPin,
    Calendar,
    Settings,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ExifDetails {
    make?: string;
    model?: string;
    dateTime?: string;
    software?: string;
    exposureTime?: string;
    fNumber?: string;
    iso?: string;
    focalLength?: string;
    latitude?: string;
    longitude?: string;
    allTags: Record<string, string>;
}

export default function ExifReaderTool() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [exif, setExif] = useState<ExifDetails | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadExif = async (imgFile: File) => {
        setIsProcessing(true);
        try {
            const ExifReader = (await import("exifreader")).default;
            const arrayBuffer = await imgFile.arrayBuffer();
            const tags = ExifReader.load(arrayBuffer);

            const details: ExifDetails = {
                make: tags.Make?.description,
                model: tags.Model?.description,
                dateTime: tags.DateTime?.description || tags.DateTimeOriginal?.description,
                software: tags.Software?.description,
                exposureTime: tags.ExposureTime?.description,
                fNumber: tags.FNumber?.description,
                iso: tags.ISOSpeedRatings?.description || tags.ISO?.description,
                focalLength: tags.FocalLength?.description,
                allTags: {}
            };

            // Format GPS coordinates if present
            if (tags.GPSLatitude && tags.GPSLongitude) {
                const latRef = tags.GPSLatitudeRef?.description || "N";
                const lonRef = tags.GPSLongitudeRef?.description || "E";
                
                // ExifReader provides latitude/longitude decimals directly in tags.GPSLatitude.value or description
                const latVal = tags.GPSLatitude.description;
                const lonVal = tags.GPSLongitude.description;
                
                details.latitude = `${latVal} ${latRef}`;
                details.longitude = `${lonVal} ${lonRef}`;
            }

            // Populate all tags for developer inspection
            Object.keys(tags).forEach(key => {
                if (tags[key] && tags[key].description) {
                    details.allTags[key] = tags[key].description;
                }
            });

            setExif(details);
            toast.success("EXIF data read successfully.");
        } catch (error) {
            console.error(error);
            toast.warning("Failed to extract EXIF data. The image may not contain metadata tags.");
            setExif({ allTags: {} });
        } finally {
            setIsProcessing(false);
        }
    };

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setExif(null);
            
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            
            await loadExif(selectedFile);
        } else if (selectedFile) {
            toast.error("Please select a valid image file");
        }
        e.target.value = "";
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Privacy Badge */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>🔒 100% Client-Side Sandbox: Your photo tags are parsed locally in RAM. No file details are transmitted.</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Camera className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Image EXIF Metadata Reader</h2>
                        <p className="text-xs text-muted-foreground">View camera model, GPS parameters, and metadata values from photos locally</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group cursor-pointer flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 hover:bg-card/40 transition-all rounded-3xl text-center"
                        >
                            <div className="p-6 bg-primary/5 rounded-2xl group-hover:scale-115 transition-all shadow-sm">
                                <Camera className="h-12 w-12 text-primary/40 group-hover:text-primary/60" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Upload Photo to Inspect EXIF</h3>
                            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                                Select any JPG, PNG, WebP, or HEIC photo. All metadata tag extraction happens entirely offline in your tab.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="border border-border/40 bg-white overflow-hidden shadow-lg rounded-3xl">
                                <div className="bg-muted/15 border-b border-border/20 py-4 px-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Eye className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-wider truncate max-w-xs">{file.name}</span>
                                    </div>
                                    <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] font-bold">Image Sandbox</Badge>
                                </div>
                                <div className="p-8 flex items-center justify-center bg-muted/5 min-h-[300px]">
                                    {previewUrl && (
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="max-h-[350px] object-contain rounded-2xl border shadow" 
                                        />
                                    )}
                                </div>
                            </Card>

                            {/* Full metadata dump */}
                            {exif && Object.keys(exif.allTags).length > 0 && (
                                <Card className="p-6 border border-border/40 bg-card/10 rounded-2xl space-y-4">
                                    <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                        <Settings className="w-3.5 h-3.5" /> All Tag Dump ({Object.keys(exif.allTags).length})
                                    </h3>
                                    <div className="max-h-[350px] overflow-y-auto pr-1 space-y-1.5">
                                        {Object.entries(exif.allTags).map(([k, v]) => (
                                            <div key={k} className="flex justify-between py-1.5 border-b border-border/10 text-xs font-mono">
                                                <span className="text-muted-foreground font-semibold">{k}</span>
                                                <span className="text-foreground text-right truncate max-w-[250px]" title={v}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side Metadata Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {isProcessing ? (
                        <Card className="p-12 text-center border-border/40 bg-card/20 space-y-4 rounded-3xl">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                            <p className="text-xs text-muted-foreground animate-pulse">Extracting metadata headers...</p>
                        </Card>
                    ) : exif ? (
                        <Card className="p-6 border border-border/40 bg-card/25 backdrop-blur-sm rounded-3xl space-y-6">
                            <h3 className="font-bold text-sm text-foreground">EXIF Properties</h3>
                            
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start border-b border-border/10 pb-3">
                                    <Camera className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Camera Model</h4>
                                        <p className="text-xs font-bold mt-0.5 text-foreground">
                                            {exif.make || exif.model ? `${exif.make || ""} ${exif.model || ""}`.trim() : "Unknown Camera"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start border-b border-border/10 pb-3">
                                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Date & Time</h4>
                                        <p className="text-xs font-bold mt-0.5 text-foreground">
                                            {exif.dateTime || "No Date Stamp"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start border-b border-border/10 pb-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase">GPS Coordinates</h4>
                                        {exif.latitude ? (
                                            <p className="text-xs font-bold mt-0.5 text-foreground">
                                                {exif.latitude}, {exif.longitude}
                                            </p>
                                        ) : (
                                            <p className="text-xs font-semibold mt-0.5 text-muted-foreground">
                                                No Location Coordinates found.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="p-3 border border-border/20 rounded-xl bg-background/50 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Exposure</span>
                                        <p className="text-xs font-bold text-foreground mt-0.5">{exif.exposureTime || "—"}</p>
                                    </div>
                                    <div className="p-3 border border-border/20 rounded-xl bg-background/50 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Aperture</span>
                                        <p className="text-xs font-bold text-foreground mt-0.5">{exif.fNumber || "—"}</p>
                                    </div>
                                    <div className="p-3 border border-border/20 rounded-xl bg-background/50 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">ISO Speed</span>
                                        <p className="text-xs font-bold text-foreground mt-0.5">{exif.iso || "—"}</p>
                                    </div>
                                    <div className="p-3 border border-border/20 rounded-xl bg-background/50 text-center">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Focal Length</span>
                                        <p className="text-xs font-bold text-foreground mt-0.5">{exif.focalLength || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-5 border border-border/40 bg-card/20 backdrop-blur-sm rounded-2xl text-xs text-muted-foreground text-center">
                            No photo loaded. Select an image to review EXIF metadata parameters.
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
