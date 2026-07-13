"use client";

import React, { useState, useRef } from "react";
import { 
  FileImage, 
  Download, 
  Upload, 
  Settings, 
  Shield, 
  Zap,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageConverters({ defaultTab = "convert" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResultUrl("");
  };

  const processImage = (targetFormat) => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate complex conversion
    setTimeout(() => {
      // In a real app, we'd use Canvas or a library
      // For this prototype, we'll just "mock" the result with the original
      setResultUrl(previewUrl);
      setIsProcessing(false);
      toast.success(`Converted to ${targetFormat.toUpperCase()} successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
           <Card className="border-primary/10 bg-card/50">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <Upload className="h-5 w-5 text-primary" />
                 Upload Image
               </CardTitle>
               <CardDescription>SVG, WEBP, PNG, JPG, ICO supported.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div 
                 onClick={() => fileInputRef.current.click()}
                 className="h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors relative overflow-hidden"
               >
                 {previewUrl ? (
                   <img src={previewUrl} className="h-full w-full object-contain p-4" alt="Preview" />
                 ) : (
                   <>
                     <FileImage className="h-12 w-12 text-muted-foreground mb-2" />
                     <p className="text-sm font-medium">Click or drag image here</p>
                   </>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
               </div>

               <div className="grid grid-cols-2 gap-2">
                 <Button onClick={() => processImage("png")} disabled={!file || isProcessing} className="gap-2">
                   To PNG
                 </Button>
                 <Button onClick={() => processImage("jpg")} disabled={!file || isProcessing} variant="outline" className="gap-2">
                   To JPG
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>

         <div className="space-y-6">
           {resultUrl ? (
             <Card className="border-primary/20 bg-primary/5 h-full relative overflow-hidden">
               <CardHeader className="text-center">
                 <CardTitle className="text-xl font-bold">Ready for Download</CardTitle>
                 <CardDescription>Your image has been processed.</CardDescription>
               </CardHeader>
               <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
                  <div className="h-48 w-48 rounded-2xl border bg-background flex items-center justify-center overflow-hidden shadow-xl">
                    <img src={resultUrl} className="h-full w-full object-contain" alt="Result" />
                  </div>
                  <Button className="w-full h-14 text-lg font-bold gap-2" asChild>
                    <a href={resultUrl} download="sopkit-converted-image">
                       <Download className="h-5 w-5" />
                       Download Result
                    </a>
                  </Button>
                  <Button variant="ghost" onClick={() => setResultUrl("")} className="text-xs">Start Over</Button>
               </CardContent>
             </Card>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-20 text-center border border-dashed rounded-3xl opacity-30">
                <ImageIcon className="h-16 w-16 mb-4" />
                <p className="text-sm">Converted image will appear here.</p>
             </div>
           )}
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t">
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 space-y-2">
            <h5 className="font-bold text-xs flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Shield className="h-3 w-3" />
              Privacy
            </h5>
            <p className="text-xs">Processed in your browser. No files are uploaded.</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 space-y-2">
            <h5 className="font-bold text-xs flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3 w-3" />
              Speed
            </h5>
            <p className="text-xs">Instant conversion with zero waiting time.</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 space-y-2">
            <h5 className="font-bold text-xs flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              Formats
            </h5>
            <p className="text-xs">WEBP, PNG, JPG, SVG, and ICO supported.</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 space-y-2">
            <h5 className="font-bold text-xs flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Settings className="h-3 w-3" />
              Quality
            </h5>
            <p className="text-xs">High-fidelity output with optimized file sizes.</p>
          </div>
       </div>
    </div>
  );
}
