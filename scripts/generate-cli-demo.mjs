/**
 * @file scripts/generate-cli-demo.mjs
 * @description Generates a pixel-perfect, world-class MP4 video and animated GIF demo
 * for SopKit CLI using headless Google Chrome frame capture and ffmpeg.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const framesDir = path.resolve(rootDir, ".temp-demo-frames");
const outputMp4 = path.resolve(rootDir, "packages/cli/assets/demo.mp4");
const outputGif = path.resolve(rootDir, "packages/cli/assets/demo.gif");
const publicGif = path.resolve(rootDir, "public/images/sopkit-cli-demo.gif");

if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
} else {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
}

// Generate the HTML canvas recording page
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SopKit CLI Demo</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 65%, #020617 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1200px;
    height: 760px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  canvas {
    border-radius: 14px;
    box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.25);
  }
</style>
</head>
<body>
<canvas id="term" width="1120" height="680"></canvas>
<script>
const canvas = document.getElementById("term");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

// Total animation frames (20 fps * 9.5s = 190 frames)
const TOTAL_FRAMES = 190;
let currentFrame = 0;

function drawWindowChrome() {
  // Terminal Window Background
  ctx.fillStyle = "#0c1017";
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 14);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Titlebar
  ctx.fillStyle = "#161b26";
  ctx.beginPath();
  ctx.roundRect(0, 0, W, 42, [14, 14, 0, 0]);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(0, 42);
  ctx.lineTo(W, 42);
  ctx.stroke();

  // Traffic Light buttons
  const buttons = [
    { x: 22, color: "#ff5f56" },
    { x: 42, color: "#ffbd2e" },
    { x: 62, color: "#27c93f" }
  ];
  buttons.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, 21, 6, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
  });

  // Title
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("shaswatraj@mac: ~ (sopkit CLI v1.0.2)", W / 2, 26);

  // Active status pill
  ctx.fillStyle = "#06b6d4";
  ctx.beginPath();
  ctx.arc(W - 35, 21, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  ctx.font = "500 11px monospace";
  ctx.textAlign = "right";
  ctx.fillText("zsh", W - 46, 25);
  ctx.textAlign = "left";
}

function drawText(text, x, y, color = "#e2e8f0", font = "14px 'SF Mono', 'JetBrains Mono', Menlo, monospace") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawBadge(text, x, y, bg = "#4f46e5", fg = "#ffffff") {
  ctx.font = "bold 11px 'SF Mono', Menlo, monospace";
  const metrics = ctx.measureText(text);
  const padH = 8;
  const h = 18;
  const w = metrics.width + padH * 2;

  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y - 13, w, h, 4);
  ctx.fill();

  ctx.fillStyle = fg;
  ctx.fillText(text, x + padH, y);
  return w + 10;
}

function renderFrame(frame) {
  ctx.clearRect(0, 0, W, H);
  drawWindowChrome();

  const startX = 32;
  let curY = 74;
  const lineHeight = 21;

  // Scene 1: Frame 0-35 (Typing 'sopkit' & Launching Banner)
  if (frame < 80) {
    // Prompt line
    drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
    const cmdText = "sopkit";
    const typedLen = Math.min(cmdText.length, Math.floor(Math.max(0, frame - 5) / 3));
    drawText(cmdText.slice(0, typedLen), startX + 160, curY, "#ffffff", "bold 14px 'SF Mono', Menlo, monospace");
    
    // Blinking cursor
    if (frame < 22 && (Math.floor(frame / 6) % 2 === 0)) {
      drawText("█", startX + 160 + typedLen * 8.5, curY, "#06b6d4");
    }

    // Banner appears after frame 22
    if (frame >= 22) {
      curY += 28;
      const bannerLines = [
        "  ███████╗  ██████╗  ██████╗  ██╗  ██╗ ██╗ ████████╗",
        "  ██╔════╝ ██╔═══██╗ ██╔══██╗ ██║ ██╔╝ ██║ ╚══██╔══╝",
        "  ███████╗ ██║   ██║ ██████╔╝ █████╔╝  ██║    ██║   ",
        "  ╚════██║ ██║   ██║ ██╔═══╝  ██╔═██╗  ██║    ██║   ",
        "  ███████║ ╚██████╔╝ ██║      ██║  ██╗ ██║    ██║   ",
        "  ╚══════╝  ╚═════╝  ╚═╝      ╚═╝  ╚═╝ ╚═╝    ╚═╝   "
      ];
      
      const gradColors = ["#a855f7", "#818cf8", "#38bdf8", "#06b6d4", "#10b981"];
      bannerLines.forEach((bl, idx) => {
        const grad = ctx.createLinearGradient(startX, 0, startX + 500, 0);
        grad.addColorStop(0, "#c084fc");
        grad.addColorStop(0.3, "#818cf8");
        grad.addColorStop(0.6, "#38bdf8");
        grad.addColorStop(1, "#34d399");
        ctx.fillStyle = grad;
        ctx.font = "bold 12px monospace";
        ctx.fillText(bl, startX, curY);
        curY += 15;
      });

      curY += 10;
      drawText("S O P K I T", startX + 12, curY, "#ffffff", "bold 13px 'SF Mono', Menlo, monospace");
      drawText(" — Privacy-First Developer Utility Suite", startX + 105, curY, "#64748b");
      curY += 22;

      let bx = startX + 12;
      bx += drawBadge("600+ Web Tools", bx, curY, "#4f46e5");
      bx += drawBadge("100% Client-Side Private", bx, curY, "#059669");
      bx += drawBadge("v1.0.2", bx, curY, "#0284c7");
      drawText("https://sopkit.space", bx, curY, "#38bdf8", "12px monospace");

      curY += 32;
      drawText("? Choose a SopKit developer utility:", startX + 12, curY, "#38bdf8", "bold 14px 'SF Mono', Menlo, monospace");
      curY += 22;

      // Menu choices
      const menu = [
        { t: "🔑  Hash Generator", tag: "CRYPTO", d: "SHA-256, SHA-512, HMAC" },
        { t: "📦  Base64 Engine", tag: "ENCODE", d: "Encode, Decode, URL-safe" },
        { t: "🆔  UUID Generator", tag: "IDENT", d: "v4 Random, v1 Timestamp" },
        { t: "🔗  URL Slugify", tag: "SEO", d: "URL-safe, SEO-friendly slugs" },
        { t: "🎨  Color Converter", tag: "DESIGN", d: "HEX, RGB, HSL with preview" },
        { t: "🔒  Password Generator", tag: "SECURITY", d: "High-entropy with visual meter" }
      ];

      // Selection animation down to password generator
      let activeIdx = 0;
      if (frame >= 35) activeIdx = 1;
      if (frame >= 45) activeIdx = 3;
      if (frame >= 55) activeIdx = 5;

      menu.forEach((m, idx) => {
        const isSel = idx === activeIdx;
        const prefix = isSel ? "❯" : " ";
        const prefColor = isSel ? "#06b6d4" : "#475569";
        const titleColor = isSel ? "#38bdf8" : "#94a3b8";

        drawText(prefix, startX + 16, curY, prefColor, "bold 13px monospace");
        drawText("[" + (idx + 1) + "]", startX + 32, curY, "#475569", "11px monospace");
        drawText(m.t, startX + 60, curY, titleColor, isSel ? "bold 13px 'SF Mono', Menlo" : "13px 'SF Mono', Menlo");
        drawText("[" + m.tag + "]", startX + 245, curY, "#a855f7", "bold 10px monospace");
        drawText("— " + m.d, startX + 310, curY, "#475569", "12px monospace");
        curY += 21;
      });

      curY += 12;
      drawText("─ ↑/↓ navigate • 1-9 quick-key • Enter select • q quit ─", startX + 24, curY, "#334155", "11px monospace");
    }
  }

  // Scene 2: Frame 80-135 (Running 'sopkit password 24' & 'sopkit color')
  else if (frame < 140) {
    drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
    drawText("sopkit password 24", startX + 160, curY, "#ffffff", "bold 14px 'SF Mono', Menlo, monospace");
    curY += 28;

    // Card top border
    drawText("╭── Generated Secure Password [SECURITY] ────────────────────────────────╮", startX, curY, "#334155", "12px monospace");
    curY += 22;
    drawText("  kF7bn!!&BmXBqGabtf*(SXF4", startX + 12, curY, "#34d399", "bold 16px 'SF Mono', Menlo, monospace");
    curY += 24;
    drawText("  Entropy:   ████████████████ Ultra Secure (134.2 bits)", startX + 12, curY, "#38bdf8", "13px monospace");
    curY += 20;
    drawText("  Length:    24 characters", startX + 12, curY, "#94a3b8", "13px monospace");
    curY += 22;
    drawText("╰────────────────────────────────────────────────────────────────────────╯", startX, curY, "#334155", "12px monospace");
    curY += 18;
    drawText("  ✔ Generated in 0.82ms", startX + 8, curY, "#10b981", "12px monospace");

    // Command 2 appears after frame 105
    if (frame >= 105) {
      curY += 34;
      drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
      const cmd2 = 'sopkit color "#ff3366"';
      drawText(cmd2, startX + 160, curY, "#ffffff", "bold 14px 'SF Mono', Menlo, monospace");
      curY += 28;

      drawText("╭── Color Preview & Conversion [PALETTE] ────────────────────────────────╮", startX, curY, "#334155", "12px monospace");
      curY += 24;

      // Draw color swatch
      ctx.fillStyle = "#ff3366";
      ctx.beginPath();
      ctx.roundRect(startX + 18, curY - 14, 52, 52, 6);
      ctx.fill();

      drawText("HEX   #FF3366", startX + 90, curY, "#38bdf8", "bold 13px monospace");
      curY += 20;
      drawText("RGB   rgb(255, 51, 102)", startX + 90, curY, "#34d399", "bold 13px monospace");
      curY += 20;
      drawText("HSL   hsl(345, 100%, 60%)", startX + 90, curY, "#c084fc", "bold 13px monospace");
      curY += 24;
      drawText("╰────────────────────────────────────────────────────────────────────────╯", startX, curY, "#334155", "12px monospace");
      curY += 18;
      drawText("  ✔ Converted in 0.45ms", startX + 8, curY, "#10b981", "12px monospace");
    }
  }

  // Scene 3: Frame 140-190 (Running 'sopkit hash' & 'sopkit uuid')
  else {
    drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
    drawText('sopkit hash sha256 "secret"', startX + 160, curY, "#ffffff", "bold 14px 'SF Mono', Menlo, monospace");
    curY += 28;

    drawText("╭── SHA256 Hash Output [CRYPTO] ─────────────────────────────────────────╮", startX, curY, "#334155", "12px monospace");
    curY += 22;
    drawText("  Input:    secret", startX + 12, curY, "#94a3b8", "13px monospace");
    curY += 20;
    drawText("  Digest:   2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b", startX + 12, curY, "#38bdf8", "bold 12px monospace");
    curY += 22;
    drawText("╰────────────────────────────────────────────────────────────────────────╯", startX, curY, "#334155", "12px monospace");
    curY += 18;
    drawText("  ✔ Computed in 0.23ms", startX + 8, curY, "#10b981", "12px monospace");

    curY += 32;
    drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
    drawText("sopkit uuid v4 3", startX + 160, curY, "#ffffff", "bold 14px 'SF Mono', Menlo, monospace");
    curY += 28;

    drawText("╭── Generated UUID(s) [RFC 4122] ────────────────────────────────────────╮", startX, curY, "#334155", "12px monospace");
    curY += 22;
    drawText("  [01]  7ac0a836-922b-498d-9885-663b1b1d0e56", startX + 12, curY, "#e2e8f0", "13px monospace");
    curY += 20;
    drawText("  [02]  d866c6b6-7255-451f-9300-334f7484b5a8", startX + 12, curY, "#e2e8f0", "13px monospace");
    curY += 20;
    drawText("  [03]  5c4d029f-ced8-492e-9868-8d1e8f6a5af6", startX + 12, curY, "#e2e8f0", "13px monospace");
    curY += 22;
    drawText("╰────────────────────────────────────────────────────────────────────────╯", startX, curY, "#334155", "12px monospace");
    curY += 18;
    drawText("  ✔ 3 generated in 0.31ms", startX + 8, curY, "#10b981", "12px monospace");

    curY += 34;
    drawText("shaswatraj@mac ~ % ", startX, curY, "#10b981", "bold 14px 'SF Mono', Menlo, monospace");
    drawText("npm install -g @sopkit/cli   # Or npx @sopkit/cli", startX + 160, curY, "#38bdf8", "italic 13px monospace");
  }
}

// Step-by-step frame exporter
async function exportNextFrame() {
  if (currentFrame >= TOTAL_FRAMES) {
    await fetch("/done");
    return;
  }

  renderFrame(currentFrame);

  // Send frame as PNG data to local Node server
  const dataUrl = canvas.toDataURL("image/png");
  await fetch("/save-frame", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ frame: currentFrame, data: dataUrl })
  });

  currentFrame++;
  setTimeout(exportNextFrame, 4);
}

// Start exporting once loaded
window.addEventListener("load", () => {
  setTimeout(exportNextFrame, 200);
});
</script>
</body>
</html>`;

// Setup HTTP server to serve the page and receive frames
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
    return;
  }

  if (req.url === "/save-frame" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { frame, data } = JSON.parse(body);
        const base64Data = data.replace(/^data:image\/png;base64,/, "");
        const frameFile = path.join(framesDir, `frame_${String(frame).padStart(4, "0")}.png`);
        fs.writeFileSync(frameFile, Buffer.from(base64Data, "base64"));
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
        if (frame % 25 === 0 || frame === 189) {
          process.stdout.write(`Captured frame ${frame} / 190\r`);
        }
      } catch (err) {
        res.writeHead(500);
        res.end(err.message);
      }
    });
    return;
  }

  if (req.url === "/done") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("DONE");
    console.log("\nAll 190 frames captured successfully!");

    // Close server and process video
    server.close();
    compileVideoAndGif();
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(9876, () => {
  console.log("Local render server listening on port 9876...");
  console.log("Launching headless Google Chrome to capture frames...");

  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const chromeArgs = [
    "--headless=new",
    "--disable-gpu",
    "--window-size=1200,760",
    "http://localhost:9876/",
  ];

  const chromeProc = spawn(chromePath, chromeArgs);
  chromeProc.on("error", (err) => {
    console.error("Failed to launch Chrome:", err);
  });
});

function compileVideoAndGif() {
  console.log("🎬 Compiling MP4 video via ffmpeg...");
  const mp4Cmd = `ffmpeg -y -framerate 20 -i "${framesDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow "${outputMp4}"`;
  execSync(mp4Cmd, { stdio: "inherit" });
  console.log(`✅ MP4 created: ${outputMp4}`);

  console.log("🎨 Generating high-quality palette-optimized GIF via ffmpeg...");
  const gifCmd = `ffmpeg -y -framerate 20 -i "${framesDir}/frame_%04d.png" -vf "scale=880:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4" "${outputGif}"`;
  execSync(gifCmd, { stdio: "inherit" });
  console.log(`✅ GIF created: ${outputGif}`);

  // Copy to public/images for web embedding
  fs.copyFileSync(outputGif, publicGif);
  console.log(`✅ Public web GIF created: ${publicGif}`);

  // Clean up temporary frames
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log("🧹 Cleaned up temporary frames.");
  console.log("🚀 All CLI demo media successfully built!");
}
