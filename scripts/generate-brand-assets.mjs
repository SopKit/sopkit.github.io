import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');

// 1. Sleek Modern SopKit Icon SVG (512x512)
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="markGrad" x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Background -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#bgGrad)" stroke="#1E293B" stroke-width="6"/>

  <!-- Subtle glow behind symbol -->
  <circle cx="256" cy="256" r="140" fill="#3B82F6" opacity="0.12" filter="url(#glow)"/>

  <!-- Modern Geometric S Logo Symbol -->
  <g filter="url(#glow)">
    <!-- Top Curve of S -->
    <path d="M 330 160 C 330 160 305 130 250 130 C 190 130 156 166 156 210 C 156 270 240 280 270 300 C 310 325 316 355 316 376 C 316 420 278 446 226 446 C 170 446 142 414 142 414" 
          stroke="url(#markGrad)" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    
    <!-- Precision Core Spark Dot -->
    <circle cx="348" cy="148" r="18" fill="url(#accentGrad)"/>
  </g>
</svg>`;

// 2. Clean Minimal 1200x630 OG Image SVG
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0B1120"/>
      <stop offset="100%" stop-color="#070A10"/>
    </linearGradient>
    <radialGradient id="glowTopLeft" cx="15%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBottomRight" cx="85%" cy="90%" r="60%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1200" height="630" fill="url(#glowTopLeft)"/>
  <rect width="1200" height="630" fill="url(#glowBottomRight)"/>

  <!-- Subtle Minimal Grid Pattern -->
  <g opacity="0.04" stroke="#FFFFFF" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="500" x2="1200" y2="500" />
  </g>

  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="28" stroke="#1E293B" stroke-width="1.5" fill="none"/>

  <!-- Content Group -->
  <g transform="translate(100, 90)">
    <!-- Brand Pill / Tag -->
    <g transform="translate(0, 0)">
      <rect width="360" height="40" rx="20" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1"/>
      <circle cx="20" cy="20" r="6" fill="#10B981"/>
      <text x="36" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" letter-spacing="0.5">100% CLIENT-SIDE • ZERO TRACKING</text>
    </g>

    <!-- Main Logo & Brand Name -->
    <g transform="translate(0, 70)">
      <rect x="0" y="0" width="48" height="48" rx="14" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
      <path d="M 33 16 C 33 16 30 13 24 13 C 18 13 15 17 15 21 C 15 27 23 28 26 30 C 30 32 31 35 31 37 C 31 41 27 44 22 44 C 17 44 14 41 14 41" 
            stroke="url(#logoGrad)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <text x="64" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">SopKit</text>
      <text x="176" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#64748B">.space</text>
    </g>

    <!-- Headline -->
    <text x="0" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="url(#textGrad)" letter-spacing="-1.5">
      600+ Free Online Tools
    </text>
    <text x="0" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#38BDF8" letter-spacing="-1.5">
      Fast, Private &amp; Offline-Ready
    </text>

    <!-- Description -->
    <text x="0" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">
      Image editors, PDF suites, developer utilities, and video converters that execute
    </text>
    <text x="0" y="355" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">
      locally inside your browser sandbox. No file uploads, no logins, no limits.
    </text>

    <!-- Feature Badges -->
    <g transform="translate(0, 400)">
      <!-- Badge 1 -->
      <rect x="0" y="0" width="180" height="38" rx="10" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <text x="90" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" text-anchor="middle">⚡ Instant Execution</text>

      <!-- Badge 2 -->
      <rect x="196" y="0" width="180" height="38" rx="10" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <text x="286" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" text-anchor="middle">🔒 Zero Data Leakage</text>

      <!-- Badge 3 -->
      <rect x="392" y="0" width="180" height="38" rx="10" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <text x="482" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" text-anchor="middle">📦 PWA &amp; Offline Ready</text>

      <!-- Badge 4 -->
      <rect x="588" y="0" width="180" height="38" rx="10" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <text x="678" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" text-anchor="middle">✨ Free Forever</text>
    </g>
  </g>
</svg>`;

async function main() {
  console.log('🚀 Generating brand assets (icons, logo, favicon, and OG images)...');

  // Ensure directories exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 1. Write SVGs
  fs.writeFileSync(path.join(iconsDir, 'base-icon.svg'), iconSvg);
  fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

  const iconBuffer = Buffer.from(iconSvg);
  const ogBuffer = Buffer.from(ogSvg);

  // 2. Generate logo.png in public root (fixes https://sopkit.space/logo.png 404!)
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✅ Generated public/logo.png (512x512)');

  // 3. Generate icon sizes for PWA & Apple
  const iconSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'icon-16x16.png', size: 16 },
    { name: 'icon-32x32.png', size: 32 },
    { name: 'icon-48x48.png', size: 48 },
    { name: 'icon-72x72.png', size: 72 },
    { name: 'icon-96x96.png', size: 96 },
    { name: 'icon-128x128.png', size: 128 },
    { name: 'icon-144x144.png', size: 144 },
    { name: 'icon-152x152.png', size: 152 },
    { name: 'icon-180x180.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-384x384.png', size: 384 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 512 },
  ];

  for (const icon of iconSizes) {
    await sharp(iconBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(path.join(iconsDir, icon.name));
    console.log(`✅ Generated public/icons/${icon.name}`);
  }

  // 4. Generate public/favicon.ico (32x32 PNG inside ICO wrapper or sharp PNG)
  await sharp(iconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✅ Generated public/favicon.ico');

  // Also copy apple-touch-icon to public root for maximum compatibility
  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ Generated public/apple-touch-icon.png');

  // 5. Generate clean, minimal OG Images (PNG and JPG)
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✅ Generated public/og-image.png (1200x630)');

  await sharp(ogBuffer)
    .resize(1200, 630)
    .jpeg({ quality: 90, progressive: true })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('✅ Generated public/og-image.jpg (1200x630)');

  console.log('🎉 All brand, icon, and OG assets generated successfully!');
}

main().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
