"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Copy, Upload, Check, Trash2 } from "lucide-react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setBase64('');
    setPreview(null);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 rounded-2xl space-y-6 text-center border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        {!preview ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF</p>
            </div>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
            
            <div className="flex justify-center gap-4">
               <Button onClick={copyToClipboard} className="gap-2 bg-primary">
                 {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Copied String' : 'Copy Base64'}
               </Button>
               <Button onClick={clear} variant="destructive" className="gap-2">
                 <Trash2 className="w-4 h-4" /> Remove
               </Button>
            </div>

            <div className="text-left">
              <label className="text-sm font-medium mb-2 block">Base64 Output</label>
              <textarea 
                readOnly 
                value={base64}
                className="w-full h-32 p-3 text-xs bg-background/50 border border-border rounded-lg font-mono resize-none focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
