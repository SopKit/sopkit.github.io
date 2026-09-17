"use client";

import React, { useMemo, useCallback } from "react";
import { Copy, Check, Palette, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useToolStorage, useCopyFeedback, useRecentHistory } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

const PRESET_SWATCHES = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#64748b",
  "#30D58C",
];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default function ColorRgbHexTool({
  mode = "color",
}: {
  mode?: "hex-rgb" | "rgb-hex" | "color";
}) {
  const [hex, setHex, { isSaved, hasStoredValue, clearStorage }] =
    useToolStorage<string>("color-tool", "hex", "#30D58C");

  const [recentSwatches, pushRecent] = useRecentHistory<string>(
    "color-tool",
    "swatches",
    8
  );

  const { copied, copy } = useCopyFeedback();

  const rgb = useMemo(() => {
    return hexToRgb(hex) || { r: 48, g: 213, b: 140 };
  }, [hex]);

  const hsl = useMemo(() => {
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }, [rgb]);

  const hexVal = hex.startsWith("#") ? hex : `#${hex}`;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Contrast calculation
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const isLight = luminance > 0.5;

  const handleCopy = async (val: string, label: string) => {
    const ok = await copy(val);
    if (ok) {
      pushRecent(hexVal);
      toast.success(`Copied ${label} to clipboard`);
    }
  };

  const handlePickColor = (newHex: string) => {
    setHex(newHex.toUpperCase());
    pushRecent(newHex.toUpperCase());
  };

  const handleRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    handlePickColor(color);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomColor}
            className="h-7 text-xs font-semibold rounded-lg"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Random Color
          </Button>

          <span className="text-xs text-muted-foreground ml-2">Presets:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => handlePickColor(swatch)}
                className="w-5 h-5 rounded-full border border-black/20 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                style={{ backgroundColor: swatch }}
                title={swatch}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ToolAutoSaveIndicator
            isSaved={isSaved}
            hasStoredValue={hasStoredValue}
            onClear={() => {
              clearStorage();
              setHex("#30D58C");
            }}
          />
        </div>
      </div>

      {/* Main Grid: Color Preview & Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Swatch Card */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="h-56 sm:h-64 rounded-2xl border border-border/60 shadow-inner flex flex-col items-center justify-center gap-2 p-6 transition-colors duration-200 relative overflow-hidden"
            style={{ backgroundColor: hexVal }}
          >
            <span
              className={`text-2xl sm:text-3xl font-mono font-extrabold tracking-wider ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {hexVal}
            </span>
            <span
              className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md backdrop-blur-md ${
                isLight
                  ? "bg-black/10 text-slate-800"
                  : "bg-white/20 text-white"
              }`}
            >
              {rgbString}
            </span>

            {/* Native Color Picker Trigger */}
            <div className="absolute bottom-3 right-3">
              <label
                htmlFor="native-color-picker"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background text-foreground text-xs font-semibold shadow-md cursor-pointer border border-border/60 transition-all"
              >
                <Palette className="w-3.5 h-3.5 text-primary" /> Pick Color
              </label>
              <input
                id="native-color-picker"
                type="color"
                value={hexVal.length === 7 ? hexVal : "#30D58C"}
                onChange={(e) => handlePickColor(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Recent Swatches */}
          {recentSwatches.length > 0 && (
            <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Recently Used Swatches:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {recentSwatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePickColor(swatch)}
                    className="w-6 h-6 rounded-lg border border-black/20 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formats Column */}
        <div className="lg:col-span-7 space-y-3">
          {/* HEX Input & Copy */}
          <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                HEX Color Code
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(hexVal, "HEX")}
                className="h-6 text-[10px] font-mono gap-1 px-2"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy HEX
              </Button>
            </div>
            <Input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="font-mono text-sm font-bold tracking-wider h-10 bg-background/80"
              placeholder="#30D58C"
            />
          </div>

          {/* RGB Output & Copy */}
          <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                RGB Color Code
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(rgbString, "RGB")}
                className="h-6 text-[10px] font-mono gap-1 px-2"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy RGB
              </Button>
            </div>
            <Input
              readOnly
              value={rgbString}
              className="font-mono text-sm font-semibold h-10 bg-muted/40"
            />
          </div>

          {/* HSL Output & Copy */}
          <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                HSL Color Code
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(hslString, "HSL")}
                className="h-6 text-[10px] font-mono gap-1 px-2"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy HSL
              </Button>
            </div>
            <Input
              readOnly
              value={hslString}
              className="font-mono text-sm font-semibold h-10 bg-muted/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
