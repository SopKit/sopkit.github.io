"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateIdenticon(seed: string, gridSize: number): boolean[][] {
  const hash = hashString(seed);
  const grid: boolean[][] = [];
  let h = hash;
  for (let r = 0; r < gridSize; r++) {
    const row: boolean[] = [];
    const half = Math.ceil(gridSize / 2);
    for (let c = 0; c < half; c++) {
      row.push((h & 1) === 1);
      h >>>= 1;
    }
    // Mirror
    const full = [...row];
    for (let c = half - (gridSize % 2 === 0 ? 1 : 2); c >= 0; c--) {
      full.push(row[c]);
    }
    grid.push(full);
  }
  return grid;
}

const PALETTES = [
  { bg: "#f0f0f0", fg: "#6366F1" }, { bg: "#f8f0e3", fg: "#e67e22" },
  { bg: "#1a1a2e", fg: "#4ECDC4" }, { bg: "#2d6a4f", fg: "#ffd166" },
  { bg: "#ff6b6b", fg: "#fff" }, { bg: "#0d1117", fg: "#58a6ff" },
];

export default function AvatarGenerator() {
  const [seed, setSeed] = useState(() => Math.random().toString(36).slice(2, 8));
  const [paletteIdx, setPaletteIdx] = useState(0);
  const gridSize = 7;
  const cellSize = 30;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = generateIdenticon(seed, gridSize);
    const palette = PALETTES[paletteIdx];
    const totalSize = gridSize * cellSize;

    ctx.clearRect(0, 0, totalSize, totalSize);
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, totalSize, totalSize);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = palette.fg;
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [seed, paletteIdx, gridSize]);

  useEffect(() => { draw(); }, [draw]);

  const randomize = useCallback(() => {
    setSeed(Math.random().toString(36).slice(2, 8));
  }, []);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `avatar-${seed}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Avatar exported!");
  }, [seed]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Avatar Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} width={gridSize * cellSize} height={gridSize * cellSize} className="rounded-xl border shadow-sm" style={{ imageRendering: "pixelated" }} />
          <div className="flex gap-2 flex-wrap justify-center">
            {PALETTES.map((p, i) => (
              <button key={i} onClick={() => setPaletteIdx(i)} className="w-8 h-8 rounded-full border-2 overflow-hidden" style={{ borderColor: paletteIdx === i ? "#000" : "transparent" }}>
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.fg} 50%)` }} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="border rounded px-2 py-1 text-xs font-mono w-32 text-center" value={seed} onChange={e => setSeed(e.target.value || "sopkit")} placeholder="Enter seed..." />
            <Button variant="outline" size="sm" onClick={randomize}>Random</Button>
            <Button variant="outline" size="sm" onClick={exportPng}>Export PNG</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
