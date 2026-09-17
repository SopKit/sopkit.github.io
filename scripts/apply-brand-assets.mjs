#!/usr/bin/env node
/**
 * @file scripts/apply-brand-assets.mjs
 * @description Ingests the user-provided high-resolution brand images and generates:
 * 1. Logo (public/logo.png)
 * 2. Complete PWA icons suite (public/icons/icon-*.png)
 * 3. Favicon (public/favicon.ico, public/favicon.svg, public/favicon.png)
 * 4. Apple Touch Icon (public/apple-touch-icon.png, public/icons/apple-touch-icon.png)
 * 5. High-resolution 1200x630 OG Images (public/og-image.png, public/og-image.jpg)
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// User-uploaded image paths
const logoSource = '/Users/shaswatraj/.gemini/antigravity-ide/brain/b55eab83-1f37-4f27-b623-a5026c5690ed/.user_uploaded/media_1789662859132.png';
const ogSource = '/Users/shaswatraj/.gemini/antigravity-ide/brain/b55eab83-1f37-4f27-b623-a5026c5690ed/.user_uploaded/media_1789662904558.png';

function createIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0); // width 32
  dirEntry.writeUInt8(32, 1); // height 32
  dirEntry.writeUInt8(0, 2);  // color count
  dirEntry.writeUInt8(0, 3);  // reserved
  dirEntry.writeUInt16LE(1, 4);  // color planes
  dirEntry.writeUInt16LE(32, 6); // bpp 32
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // image byte size
  dirEntry.writeUInt32LE(6 + 16, 12); // offset (22)

  return Buffer.concat([header, dirEntry, pngBuffer]);
}

async function main() {
  console.log('🎨 Processing brand assets from user uploads...');

  if (!fs.existsSync(logoSource) || !fs.existsSync(ogSource)) {
    throw new Error('User upload source images not found.');
  }

  // 1. Generate public/logo.png (512x512 high-res crisp logo)
  await sharp(logoSource)
    .resize({
      width: 512,
      height: 512,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('✅ Generated public/logo.png (512x512)');

  // 2. Generate Apple Touch Icons (180x180)
  // Apple recommends rounded-rect friendly margins
  const appleTouchBuffer = await sharp(logoSource)
    .resize({
      width: 180,
      height: 180,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchBuffer);
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouchBuffer);
  console.log('✅ Generated public/apple-touch-icon.png (180x180)');
  console.log('✅ Generated public/icons/apple-touch-icon.png (180x180)');

  // 3. Generate Suite of PWA Icons
  const pwaSizes = [
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
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon.png', size: 512 },
  ];

  for (const item of pwaSizes) {
    await sharp(logoSource)
      .resize({
        width: item.size,
        height: item.size,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(iconsDir, item.name));
    console.log(`✅ Generated public/icons/${item.name}`);
  }

  // 4. Generate public/favicon.ico with valid binary ICO structure
  const fav32Buffer = await sharp(logoSource)
    .resize({
      width: 32,
      height: 32,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const icoBuffer = createIco(fav32Buffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✅ Generated public/favicon.ico (Standard 32x32 ICO binary)');

  // 5. Generate public/favicon.svg (embed high-res base64 PNG in vector shell for crisp SVG rendering)
  const logo512Base64 = (await sharp(logoSource).resize(256, 256).png().toBuffer()).toString('base64');
  const faviconSvg = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image width="256" height="256" href="data:image/png;base64,${logo512Base64}" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
  fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSvg);
  console.log('✅ Generated public/favicon.svg and public/icons/favicon.svg');

  // 6. Generate 1200x630 OG Images (PNG and JPG)
  // Background matches the subtle top/side tint of the banner: #f8fbfd
  await sharp(ogSource)
    .resize({
      width: 1200,
      height: 630,
      fit: 'contain',
      background: { r: 248, g: 251, b: 253, alpha: 1 },
    })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✅ Generated public/og-image.png (1200x630 High-Def OpenGraph Image)');

  await sharp(ogSource)
    .resize({
      width: 1200,
      height: 630,
      fit: 'contain',
      background: { r: 248, g: 251, b: 253, alpha: 1 },
    })
    .jpeg({ quality: 92, progressive: true })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('✅ Generated public/og-image.jpg (1200x630 High-Def JPEG)');

  console.log('🎉 Brand assets replacement completed successfully!');
}

main().catch((err) => {
  console.error('❌ Failed generating brand assets:', err);
  process.exit(1);
});
