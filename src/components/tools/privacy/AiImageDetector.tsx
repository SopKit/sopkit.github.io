"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AiImageDetector() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; details: string[] } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = async (file: File) => {
    setLoading(true);
    const details: string[] = [];
    let score = 50;

    if (!file.type.startsWith("image/")) {
      setResult({ score: 0, details: ["Not a valid image file"] });
      setLoading(false);
      return;
    }

    details.push(`Format: ${file.type}`);
    details.push(`Size: ${(file.size / 1024).toFixed(1)} KB`);
    details.push(`Dimensions: checking...`);

    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });

    details[2] = `Dimensions: ${img.width} × ${img.height}`;

    if (img.width < 256 || img.height < 256) { score -= 10; details.push("Small image size (possible generated thumbnail)"); }
    const aspectRatio = img.width / img.height;
    if (Math.abs(aspectRatio - 1) < 0.05) { score += 5; details.push("Square aspect ratio (common in AI images)"); }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "png") { score += 5; details.push("PNG format (common for AI-generated images)"); }
    if (file.size < 50000 && img.width > 500) { score += 10; details.push("High resolution with small file size (possible AI compression artifact)"); }

    setPreview(url);
    setResult({ score: Math.max(0, Math.min(100, score)), details });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Image Detector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && analyze(e.target.files[0])} />
        <Button onClick={() => fileRef.current?.click()} disabled={loading}>Upload Image</Button>
        {preview && <img src={preview} alt="Uploaded" className="max-h-48 rounded border" />}
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className={`text-xl font-bold ${result.score >= 60 ? "text-yellow-600" : "text-green-600"}`}>
                {result.score >= 60 ? "Likely AI-generated" : "Likely natural photo"}
              </span>
              <span className="text-sm text-muted-foreground">Score: {result.score}/100</span>
            </div>
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5">
              {result.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
