import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsPath = path.join(__dirname, '..', 'src', 'constants', 'tools.json');
const faqsPath = path.join(__dirname, '..', 'src', 'data', 'tool-faqs.json');

const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
const faqsData = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));

const allTools = [];
for (const [catKey, catObj] of Object.entries(toolsData.categories)) {
  for (const t of (catObj.tools || [])) {
    allTools.push({ ...t, categoryKey: catKey });
  }
}

function cleanName(name) {
  return name.replace(/\s+(online|free)$/i, '').trim();
}

function generateSpecificFaqs(tool) {
  const rawName = cleanName(tool.name);
  const desc = tool.description || '';
  const lowerName = rawName.toLowerCase();
  const lowerId = tool.id.toLowerCase();
  const category = tool.categoryKey || '';

  const qas = [];

  // Question 1: Specific functionality
  if (lowerId.includes('converter') || lowerId.includes('-to-')) {
    const parts = rawName.replace(/\s+converter$/i, '').split(/\s+to\s+/i);
    const fromType = parts[0] ? parts[0].trim() : 'input data';
    const toType = parts[1] ? parts[1].trim() : 'target format';
    qas.push({
      question: `How does the ${rawName} process conversion?`,
      answer: `The tool parses your ${fromType} content directly within your browser session and transforms it into ${toType} format while preserving original layout and data integrity.`
    });
  } else if (lowerId.includes('calculator')) {
    qas.push({
      question: `How are calculations performed in ${rawName}?`,
      answer: `${rawName} calculates results dynamically using precision mathematical algorithms as soon as you enter or update your numbers.`
    });
  } else if (lowerId.includes('generator') || lowerId.includes('maker')) {
    qas.push({
      question: `What customization options does ${rawName} offer?`,
      answer: `${rawName} provides interactive controls allowing you to customize output text, formatting, styles, and parameters to match your needs.`
    });
  } else if (lowerId.includes('downloader')) {
    qas.push({
      question: `What media formats can I download using ${rawName}?`,
      answer: `${rawName} analyzes public media links and lets you save high-quality video or audio files directly to your device storage.`
    });
  } else if (lowerId.includes('checker') || lowerId.includes('validator') || lowerId.includes('analyzer') || lowerId.includes('tester') || lowerId.includes('auditor')) {
    qas.push({
      question: `What parameters or standards does ${rawName} inspect?`,
      answer: `${rawName} checks your input against standard specs, syntax patterns, and security guidelines, providing clear recommendations and feedback.`
    });
  } else if (lowerId.includes('compressor') || lowerId.includes('resizer') || lowerId.includes('optimizer') || lowerId.includes('remover')) {
    qas.push({
      question: `Does ${rawName} affect visual or data quality?`,
      answer: `${rawName} utilizes optimized local processing algorithms to compress file size or adjust properties while keeping quality loss to an absolute minimum.`
    });
  } else {
    qas.push({
      question: `What is the main function of ${rawName}?`,
      answer: `${rawName} helps you ${desc ? desc.toLowerCase().replace(/\.$/, '') : 'process tasks'} instantly with browser-native processing and zero installation.`
    });
  }

  // Question 2: Privacy / Browser Execution
  if (category === 'pdf' || category === 'image' || lowerId.includes('pdf') || lowerId.includes('image') || lowerId.includes('photo')) {
    qas.push({
      question: `Are my files or photos uploaded to a remote server?`,
      answer: `No. All file processing for ${rawName} happens 100% locally on your computer using web browser APIs. No files leave your device.`
    });
  } else if (category === 'calculators' || category === 'health' || lowerId.includes('calculator') || lowerId.includes('finance')) {
    qas.push({
      question: `Is my numeric or financial data recorded when using ${rawName}?`,
      answer: `No data is recorded, cached, or transmitted to external servers. All calculations occur inside your browser memory.`
    });
  } else if (category === 'developer' || lowerId.includes('json') || lowerId.includes('code') || lowerId.includes('base64') || lowerId.includes('sql')) {
    qas.push({
      question: `Is it safe to process confidential code or payloads with ${rawName}?`,
      answer: `Yes. All encoding, parsing, and formatting runs entirely client-side. No API keys, passwords, or code snippets leave your device.`
    });
  } else {
    qas.push({
      question: `Is ${rawName} private and secure to use?`,
      answer: `Yes. SopKit operates on a client-side execution model. Your input remains private inside your web browser with zero tracking.`
    });
  }

  // Question 3: Compatibility & Commercial / Licensing Rights
  if (lowerId.includes('generator') || lowerId.includes('maker') || lowerId.includes('converter') || lowerId.includes('editor')) {
    qas.push({
      question: `Can I use the outputs from ${rawName} for commercial purposes?`,
      answer: `Yes. Any files, text, images, or documents generated using ${rawName} are free to use for both personal and commercial work.`
    });
  } else {
    qas.push({
      question: `Does ${rawName} work on mobile devices?`,
      answer: `Yes. ${rawName} is fully responsive and compatible with modern web browsers on smartphones, tablets, and desktop computers.`
    });
  }

  return qas;
}

// Re-generate for tools that were populated by the generator or missing
for (const tool of allTools) {
  // If the entry is missing or empty, generate specific FAQs
  if (!faqsData[tool.id] || faqsData[tool.id].length === 0) {
    faqsData[tool.id] = generateSpecificFaqs(tool);
  }
}

fs.writeFileSync(faqsPath, JSON.stringify(faqsData, null, 2), 'utf8');
console.log(`✅ Refined FAQs in tool-faqs.json! Total tools with FAQs: ${Object.keys(faqsData).length}`);

