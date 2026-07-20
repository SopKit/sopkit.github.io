"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const TEMPLATES = [
  { name: "Classic", bg: "#f0f0f0", color: "#000" },
  { name: "Dark", bg: "#1a1a2e", color: "#fff" },
  { name: "Vibrant", bg: "#667eea", color: "#fff" },
  { name: "Warm", bg: "#ff6b6b", color: "#fff" },
  { name: "Nature", bg: "#2d6a4f", color: "#fff" },
];

export default function MemeGenerator() {
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (image) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        drawText(ctx, w, h);
      };
      img.src = image;
    } else {
      ctx.fillStyle = template.bg;
      ctx.fillRect(0, 0, w, h);
      drawText(ctx, w, h);
    }
  }, [topText, bottomText, image, template]);

  function drawText(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const fontSize = Math.min(w, h) * 0.12;
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = fontSize * 0.08;
    ctx.fillStyle = template.color;

    if (topText) {
      ctx.textBaseline = "top";
      ctx.strokeText(topText, w / 2, fontSize * 0.3);
      ctx.fillText(topText, w / 2, fontSize * 0.3);
    }
    if (bottomText) {
      ctx.textBaseline = "bottom";
      ctx.strokeText(bottomText, w / 2, h - fontSize * 0.3);
      ctx.fillText(bottomText, w / 2, h - fontSize * 0.3);
    }
  }

  useEffect(() => { draw(); }, [draw]);

  const exportMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Meme exported!");
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Meme Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Input placeholder="Top text" value={topText} onChange={e => setTopText(e.target.value.toUpperCase())} />
            <Input placeholder="Bottom text" value={bottomText} onChange={e => setBottomText(e.target.value.toUpperCase())} />
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map(t => (
                <button key={t.name} onClick={() => { setTemplate(t); setImage(null); }} className={`px-3 py-1 text-xs rounded-full border ${template.name === t.name ? "bg-primary text-primary-foreground" : ""}`} style={{ borderColor: t.bg }}>
                  {t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => document.getElementById("meme-image-input")?.click()}>Upload Image</Button>
              <Button variant="outline" size="sm" onClick={() => setImage(null)}>Reset</Button>
            </div>
            <input id="meme-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <canvas ref={canvasRef} width={400} height={300} className="w-full max-w-[400px] rounded-lg border shadow-sm" />
            <Button size="sm" onClick={exportMeme}>Export PNG</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
