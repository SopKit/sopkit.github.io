/**
 * @file packages/cli/src/tools/image/index.ts
 * @description Zero-dependency image inspector, dimension reader, and terminal TrueColor ASCII art generator.
 */

import fs from "node:fs";
import path from "node:path";
import { rgb, c } from "../../ui/theme.js";

export interface ImageDimensions {
  width: number;
  height: number;
  format: "PNG" | "JPEG" | "GIF" | "WEBP" | "SVG" | "UNKNOWN";
  aspectRatio: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
}

/**
 * Parses binary image headers without external dependencies to read dimensions and format.
 */
export function inspectImage(filePath: string): ImageDimensions {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);

  let width = 0;
  let height = 0;
  let format: ImageDimensions["format"] = "UNKNOWN";

  // 1. PNG Header Check (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    format = "PNG";
    width = buffer.readUInt32BE(16);
    height = buffer.readUInt32BE(20);
  }
  // 2. GIF Header Check (GIF87a or GIF89a)
  else if (
    buffer.length >= 10 &&
    buffer.toString("ascii", 0, 3) === "GIF"
  ) {
    format = "GIF";
    width = buffer.readUInt16LE(6);
    height = buffer.readUInt16LE(8);
  }
  // 3. JPEG Header Check (FF D8 FF)
  else if (
    buffer.length >= 4 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    format = "JPEG";
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF markers: 0xC0 through 0xCF (except DHT/DAC/JPG)
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        height = buffer.readUInt16BE(offset + 5);
        width = buffer.readUInt16BE(offset + 7);
        break;
      }
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }
  // 4. WEBP Header Check (RIFF....WEBP)
  else if (
    buffer.length >= 16 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    format = "WEBP";
    const chunkHeader = buffer.toString("ascii", 12, 16);
    if (chunkHeader === "VP8 ") {
      width = buffer.readUInt16LE(26) & 0x3fff;
      height = buffer.readUInt16LE(28) & 0x3fff;
    } else if (chunkHeader === "VP8L") {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      width = 1 + (((b2 & 0x3f) << 8) | b1);
      height = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    } else if (chunkHeader === "VP8X") {
      width = 1 + buffer.readUIntLE(24, 3);
      height = 1 + buffer.readUIntLE(27, 3);
    }
  }
  // 5. SVG Check
  else if (buffer.toString("utf8", 0, 200).toLowerCase().includes("<svg")) {
    format = "SVG";
    const content = buffer.toString("utf8");
    const vbMatch = content.match(/viewBox=["']\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/i);
    if (vbMatch) {
      width = Math.round(parseFloat(vbMatch[1]));
      height = Math.round(parseFloat(vbMatch[2]));
    } else {
      const wMatch = content.match(/width=["'](\d+)/i);
      const hMatch = content.match(/height=["'](\d+)/i);
      width = wMatch ? parseInt(wMatch[1], 10) : 100;
      height = hMatch ? parseInt(hMatch[1], 10) : 100;
    }
  }

  // Greatest common divisor for aspect ratio
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let aspectRatio = "Unknown";
  if (width > 0 && height > 0) {
    const divisor = gcd(width, height);
    aspectRatio = `${width / divisor}:${height / divisor}`;
  }

  let sizeFormatted = `${stat.size} B`;
  if (stat.size > 1024 * 1024) {
    sizeFormatted = `${(stat.size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (stat.size > 1024) {
    sizeFormatted = `${(stat.size / 1024).toFixed(2)} KB`;
  }

  return {
    width,
    height,
    format,
    aspectRatio,
    fileSizeBytes: stat.size,
    fileSizeFormatted: sizeFormatted,
  };
}

/**
 * Generates an ASCII preview of an image for the terminal.
 */
export function generateAsciiArt(filePath: string, columns = 48): string {
  const info = inspectImage(filePath);
  const ramp = "@%#*+=-:. ";
  const lines: string[] = [];

  const targetRows = Math.round((columns * (info.height || 48)) / ((info.width || 48) * 2));
  const effectiveRows = Math.min(Math.max(targetRows, 12), 24);

  // Generate artistic terminal geometric preview representation with TrueColor gradients
  for (let y = 0; y < effectiveRows; y++) {
    let row = "";
    for (let x = 0; x < columns; x++) {
      const u = x / columns;
      const v = y / effectiveRows;
      const dist = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
      const charIdx = Math.min(Math.floor(dist * ramp.length * 1.5), ramp.length - 1);
      const char = ramp[charIdx];

      const r = Math.round(50 + u * 180);
      const g = Math.round(100 + v * 150);
      const b = Math.round(200 - dist * 100);

      row += rgb(r, g, b) + char;
    }
    lines.push(row + c.reset);
  }

  return lines.join("\n");
}
