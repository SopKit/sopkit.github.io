import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

const directories = [
  'src/components/tools/developer',
  'src/components/tools/downloaders',
  'src/components/tools/image',
  'src/components/tools/pdf',
  'src/components/tools/text',
  'src/components/tools/youtube'
];

console.log('🔍 Scanning components for placeholder text or short content...');

for (const dir of directories) {
  const dirPath = path.join(workspaceRoot, dir);
  if (!fs.existsSync(dirPath)) continue;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if the component is very short (less than 300 characters)
    // or contains obvious placeholder text
    const lower = content.toLowerCase();
    const isShort = content.length < 300;
    const hasTodo = lower.includes('todo:') || lower.includes('placeholder component');
    const isMock = lower.includes('mock') && !lower.includes('mockup') && !lower.includes('mockapi');

    if (isShort || hasTodo || isMock) {
      console.log(`⚠️ Potential Placeholder: ${dir}/${file} (${content.length} chars, hasTodo: ${hasTodo}, isMock: ${isMock})`);
    }
  }
}
