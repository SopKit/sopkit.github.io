const sharp = require('sharp');
const path = require('path');

const src = path.resolve(__dirname, '../public/icons/base-icon.png');
const iconsDir = path.resolve(__dirname, '../public/icons');
const publicDir = path.resolve(__dirname, '../public');

const targets = [
  { file: 'favicon-16x16.png', size: 16, dir: iconsDir },
  { file: 'favicon-32x32.png', size: 32, dir: iconsDir },
  { file: 'icon-32x32.png', size: 32, dir: iconsDir },
  { file: 'icon-16x16.png', size: 16, dir: iconsDir },
  { file: 'icon-48x48.png', size: 48, dir: iconsDir },
  { file: 'icon-72x72.png', size: 72, dir: iconsDir },
  { file: 'icon-96x96.png', size: 96, dir: iconsDir },
  { file: 'icon-128x128.png', size: 128, dir: iconsDir },
  { file: 'icon-144x144.png', size: 144, dir: iconsDir },
  { file: 'icon-152x152.png', size: 152, dir: iconsDir },
  { file: 'icon-180x180.png', size: 180, dir: iconsDir },
  { file: 'icon-192x192.png', size: 192, dir: iconsDir },
  { file: 'icon-384x384.png', size: 384, dir: iconsDir },
  { file: 'icon-512x512.png', size: 512, dir: iconsDir },
  { file: 'apple-touch-icon.png', size: 180, dir: iconsDir },
  { file: 'favicon.png', size: 512, dir: iconsDir },
];

async function main() {
  console.log('Generating PWA icons...');
  for (const target of targets) {
    const dest = path.join(target.dir, target.file);
    await sharp(src)
      .resize(target.size, target.size)
      .toFile(dest);
    console.log(`Generated: ${target.file} (${target.size}x${target.size})`);
  }

  // Generate favicon.ico
  const icoDest = path.join(publicDir, 'favicon.ico');
  await sharp(src)
    .resize(32, 32)
    .toFile(icoDest);
  console.log('Generated: favicon.ico (32x32)');

  console.log('All icons generated successfully!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
