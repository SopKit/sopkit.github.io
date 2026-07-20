"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Harmony = "complementary" | "analogous" | "triadic" | "tetradic" | "split-complementary";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}

function hexToHSL(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const h = hex.replace("#", "");
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hh = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: hh = ((b - r) / d + 2) * 60; break;
      case b: hh = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(hh), Math.round(s * 100), Math.round(l * 100)];
}

function generatePalette(baseColor: string, harmony: Harmony): string[] {
  const [h, s, l] = hexToHSL(baseColor);
  switch (harmony) {
    case "complementary": return [hslToHex(h, s, l), hslToHex((h + 180) % 360, s, l)];
    case "analogous": return [hslToHex(h, s, l), hslToHex((h + 30) % 360, s, l), hslToHex((h + 60) % 360, s, l)];
    case "triadic": return [hslToHex(h, s, l), hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case "tetradic": return [hslToHex(h, s, l), hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
    case "split-complementary": return [hslToHex(h, s, l), hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    default: return [baseColor];
  }
}

const RANDOM_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#6366F1");
  const [harmony, setHarmony] = useState<Harmony>("analogous");
  const palette = generatePalette(baseColor, harmony);

  const randomize = useCallback(() => {
    setBaseColor(RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)]);
  }, []);

  const copyAll = useCallback(() => {
    const css = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("CSS variables copied!");
  }, [palette]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Color Palette Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <input type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
          <input type="text" value={baseColor} onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setBaseColor(e.target.value)} className="border rounded px-2 py-1 text-xs font-mono w-24" />
          <Button variant="outline" size="sm" onClick={randomize}>Random</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["analogous", "complementary", "triadic", "tetradic", "split-complementary"] as Harmony[]).map(h => (
            <button key={h} onClick={() => setHarmony(h)} className={`px-3 py-1 text-xs rounded-full border ${harmony === h ? "bg-primary text-primary-foreground" : ""}`}>{h.replace("-", " ")}</button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {palette.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-lg border shadow-sm cursor-pointer" style={{ background: color }} onClick={() => { navigator.clipboard.writeText(color); toast.success("Copied " + color); }} title="Click to copy" />
              <span className="text-[10px] font-mono text-muted-foreground">{color}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll}>Copy as CSS</Button>
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(palette.join(", ")); toast.success("Copied as comma-separated"); }}>Copy as CSV</Button>
        </div>
      </CardContent>
    </Card>
  );
}
