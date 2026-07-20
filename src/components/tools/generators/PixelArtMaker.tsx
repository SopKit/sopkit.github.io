"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["#000000", "#ffffff", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
const GRID_SIZE = 16;
const PIXEL_SIZE = 20;

export default function PixelArtMaker() {
  const [pixels, setPixels] = useState<string[][]>(() =>
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff"))
  );
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[][][]>([]);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const paint = useCallback((row: number, col: number) => {
    setPixels(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = color;
      return next;
    });
  }, [color]);

  const saveState = useCallback(() => {
    setHistory(prev => [...prev, pixels.map(r => [...r])].slice(-20));
  }, [pixels]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, GRID_SIZE * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE);
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        ctx.fillStyle = pixels[r][c];
        ctx.fillRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }, [pixels]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setPixels(prev);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  const clear = useCallback(() => {
    saveState();
    setPixels(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff")));
  }, [saveState]);

  const exportPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = GRID_SIZE * 4;
    canvas.height = GRID_SIZE * 4;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        ctx.fillStyle = pixels[r][c];
        ctx.fillRect(c * 4, r * 4, 4, 4);
      }
    }
    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Pixel art exported!");
  }, [pixels]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pixel Art Maker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} className="w-6 h-6 rounded-full border-2 shadow-sm" style={{ background: c, borderColor: color === c ? "#000" : "#e5e7eb" }} title={c} />
          ))}
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-6 w-8 rounded cursor-pointer" />
        </div>
        <div className="flex items-start gap-4 flex-wrap">
          <canvas
            ref={previewRef}
            width={GRID_SIZE * PIXEL_SIZE}
            height={GRID_SIZE * PIXEL_SIZE}
            className="border rounded-lg shadow-sm cursor-crosshair"
            style={{ imageRendering: "pixelated" }}
            onMouseDown={(e) => {
              const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
              const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
              if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
                saveState();
                paint(y, x);
                setIsDrawing(true);
              }
            }}
            onMouseMove={(e) => {
              if (!isDrawing) return;
              const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
              const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
              if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) paint(y, x);
            }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          />
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={exportPng}>Export PNG</Button>
            <Button variant="outline" size="sm" onClick={undo} disabled={history.length === 0}>Undo</Button>
            <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
