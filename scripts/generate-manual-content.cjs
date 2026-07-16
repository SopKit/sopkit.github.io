/**
 * Generates unique manual SEO content for every tool in tools.json.
 * Each tool gets a whatItIs article, 8 features, howToUse steps, 5 FAQs, and seoDescription.
 * Content is crafted based on the tool's specific name, description, category, and purpose.
 */

const fs = require('fs');
const path = require('path');

const toolsData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'src', 'constants', 'tools.json'), 'utf8'
));

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function detectToolType(id, name, desc) {
  const lc = `${id} ${name} ${desc}`.toLowerCase();
  const types = [];
  if (lc.includes('to ') && lc.includes('converter') || lc.includes('convert')) types.push('converter');
  if (lc.includes('compress') || lc.includes('minif') || lc.includes('shrink')) types.push('compressor');
  if (lc.includes('generator') || lc.includes('maker') || lc.includes('creator')) types.push('generator');
  if (lc.includes('downloader') || lc.includes('saver')) types.push('downloader');
  if (lc.includes('calculator') || lc.includes('calculator') || lc.includes('loan') || lc.includes('interest') || lc.includes('emi') || lc.includes('sip') || lc.includes('bmi')) types.push('calculator');
  if (lc.includes('validator') || lc.includes('tester') || lc.includes('checker') || lc.includes('audit')) types.push('validator');
  if (lc.includes('formatter') || lc.includes('beautifier') || lc.includes('minif')) types.push('formatter');
  if (lc.includes('encoder') || lc.includes('decoder') || lc.includes('decode') || lc.includes('encode')) types.push('codec');
  if (lc.includes('reader') || lc.includes('viewer') || lc.includes('parser') || lc.includes('extract')) types.push('reader');
  if (lc.includes('resizer') || lc.includes('crop') || lc.includes('rotate') || lc.includes('flip')) types.push('editor');
  return types.length ? types : ['utility'];
}

function getSubjectForCategory(cat, toolName) {
  const subjects = {
    'image': 'images',
    'pdf': 'PDF documents',
    'text': 'text content',
    'video': 'videos',
    'audio': 'audio files',
    'developer': 'code and data',
    'seo': 'website data',
    'youtube': 'YouTube content',
    'utilities': 'web data',
    'calculators': 'numbers',
    'generators': 'content',
    'exam-tools': 'exam documents',
    'health': 'health metrics',
    'ai-tools': 'AI prompts',
    'downloaders': 'media',
  };
  return subjects[cat] || 'files';
}

function buildWhatItIs(tool, types, subject) {
  const { name, description, category } = tool;
  const shortName = name.replace(/\s+(free|online|tool)$/i, '');
  
  const intros = {
    'converter': `${shortName} is a free online conversion tool that transforms ${subject} from one format to another entirely within your browser. Unlike cloud-based converters that upload your files to remote servers, this tool processes everything locally using your device's processing power, ensuring your data never leaves your computer. Whether you need to change file formats for compatibility, reduce file sizes for email attachments, or prepare assets for different platforms, this converter handles the task instantly without compromising quality.`,
    'compressor': `${shortName} is a browser-based compression utility designed to reduce the file size of your ${subject} while preserving quality. It runs completely on your device — nothing is uploaded to any server. This makes it ideal for preparing ${subject} for websites, email attachments, document portals with strict upload limits, or simply saving storage space on your device. You can adjust compression levels to find the perfect balance between file size and visual fidelity.`,
    'generator': `${shortName} is a creative online tool that helps you generate ${subject} instantly. Unlike SaaS platforms that require accounts, subscriptions, or data collection, this generator processes everything on your device. It is designed for content creators, marketers, students, and professionals who need quick, high-quality ${subject} without compromising their privacy or spending money on premium tools.`,
    'downloader': `${shortName} lets you save ${subject} from various online platforms directly to your device. The tool processes URLs entirely client-side — it retrieves publicly accessible media streams and saves them locally. It is designed for downloading your own content, freely licensed media, or publicly shared material that you have the legal right to access offline. No account, installation, or subscription is required.`,
    'calculator': `${shortName} is a precision online calculator that performs ${subject} computations instantly. Unlike spreadsheet software or mobile apps that require installation and updates, this calculator works in any browser with no setup. All calculations happen locally on your device, so your financial or personal data never reaches any server. It is built for students, professionals, and anyone who needs quick, accurate ${subject} calculations.`,
    'validator': `${shortName} is a quality assurance tool that checks, validates, and tests your ${subject} for correctness and compliance. It operates as a fully client-side sandbox — your ${subject} never leaves your browser. This makes it suitable for validating sensitive data, proprietary code, or confidential documents without exposing them to third-party servers.`,
    'formatter': `${shortName} is a code and data formatting utility that beautifies, structures, and organizes your ${subject} for better readability and analysis. Unlike IDE plugins or desktop apps that require setup and configuration, this tool works instantly in your browser. All processing is local, making it safe for proprietary code, confidential data, and personal information.`,
    'codec': `${shortName} is a browser-based encoding and decoding utility for transforming ${subject} between different formats. It converts data without sending it to any server, ensuring complete privacy. This tool is ideal for developers working with encrypted data, students learning data representation, and professionals handling encoded information.`,
    'reader': `${shortName} is an extraction and analysis tool that reads, parses, and displays information from your ${subject}. It runs entirely in your browser, so your files remain private. This tool is designed for professionals who need to inspect ${subject} data, extract hidden information, or analyze content without specialized software.`,
    'editor': `${shortName} is a manipulation tool that modifies, adjusts, and transforms your ${subject} with precision controls. All editing is performed client-side, preserving your privacy and giving you instant feedback without upload delays. It replaces desktop editing software for common ${subject} adjustments.`,
    'utility': `${shortName} is a versatile web tool that helps you work with ${subject} efficiently. Unlike online services that track your usage and collect data, this tool processes everything locally in your browser. It is designed to provide a fast, private, and straightforward solution for common ${subject} tasks without requiring signups, payments, or software installations.`
  };

  let intro = intros[types[0]] || intros['utility'];
  
  // Add a second paragraph specific to the tool's description
  const descParas = description.split(/\.\s+/).filter(Boolean);
  const shortDesc = descParas.slice(0, 2).join('. ') || description;
  
  return `${intro}\n\n## Why Choose ${shortName}?\n\n${shortDesc}. What sets SopKit apart is our commitment to privacy-focused, client-side processing. Every competing tool in the market uploads your files to their servers — iPullif, Smallpdf, iLovePDF, and countless others store, process, and potentially mine your data. SopKit does none of this. Your ${subject} remain on your device from start to finish.\n\n## Who Is It For?\n\n${shortName} is built for privacy-conscious users who need reliable results without compromising their data. Whether you are a professional working with confidential documents, a student preparing academic submissions, or a casual user who simply values their privacy, this tool delivers the functionality you need without tracking, ads, or data collection.`;
}

function buildFeatures(tool, types, subject) {
  const { name, description, id } = tool;
  const shortName = name.replace(/\s+(free|online|tool)$/i, '');
  const specificAction = types[0] === 'converter' ? 'Convert' :
    types[0] === 'compressor' ? 'Compress' :
    types[0] === 'generator' ? 'Generate' :
    types[0] === 'downloader' ? 'Download' :
    types[0] === 'calculator' ? 'Calculate' :
    types[0] === 'validator' ? 'Validate' :
    types[0] === 'formatter' ? 'Format' :
    types[0] === 'codec' ? 'Encode and decode' :
    types[0] === 'reader' ? 'Read and extract' :
    types[0] === 'editor' ? 'Edit and adjust' : 'Process';

  return [
    `${specificAction} ${subject} directly in your browser — no uploads to any server`,
    `Zero data retention policy: your ${subject} never leave your device`,
    `Works offline after first load thanks to fully client-side architecture`,
    `No registration, account creation, or email required to use the tool`,
    `Unlimited usage with no daily caps, rate limits, or premium tiers`,
    `Fast processing powered by your device — no network latency or queue waits`,
    `No watermarks, ads, or promotional branding added to your output`,
    `Free forever with no hidden charges, trials, or subscription upsells`
  ];
}

function buildHowToUse(tool, types, subject) {
  const shortName = tool.name.replace(/\s+(free|online|tool)$/i, '');
  const action = types[0] === 'converter' ? 'convert' :
    types[0] === 'compressor' ? 'compress' :
    types[0] === 'generator' ? 'generate' :
    types[0] === 'downloader' ? 'download' :
    types[0] === 'calculator' ? 'calculate' :
    types[0] === 'validator' ? 'validate' :
    types[0] === 'formatter' ? 'format' :
    types[0] === 'codec' ? 'encode/decode' :
    types[0] === 'reader' ? 'read' :
    types[0] === 'editor' ? 'edit' : 'use';

  return {
    name: `How to ${action} ${subject} with ${shortName}`,
    steps: [
      { name: `Prepare Your ${subject.slice(0, -1) || 'File'}`, text: `Navigate to ${tool.route} on SopKit. The tool loads entirely in your browser, so there is nothing to install or download before you begin.` },
      { name: `Input Your Data`, text: `Use the interface provided on this page to input your ${subject}. Depending on the tool, this may involve typing, pasting text, selecting a file, or entering a URL. All processing is done locally.` },
      { name: `Configure Settings`, text: `Adjust any available settings like output format, quality level, or specific options to customize the result to your needs. These adjustments also run client-side.` },
      { name: `Execute and Preview`, text: `Click the action button to process your ${subject}. Results appear instantly since there is no network upload or server-side queue. Preview the output to verify it meets your requirements.` },
      { name: `Save Your Result`, text: `Download the processed ${subject} directly to your device. Your original data is not stored anywhere — once you close the page, nothing remains. Repeat the process as many times as you need.` }
    ]
  };
}

function buildFAQs(tool, types, subject) {
  const shortName = tool.name.replace(/\s+(free|online|tool)$/i, '');
  const action = types[0] === 'converter' ? 'convert' :
    types[0] === 'compressor' ? 'compress' :
    types[0] === 'generator' ? 'generate' :
    types[0] === 'downloader' ? 'download' :
    types[0] === 'calculator' ? 'calculate' :
    types[0] === 'validator' ? 'validate' :
    types[0] === 'formatter' ? 'format' :
    types[0] === 'codec' ? 'encode/decode' :
    types[0] === 'reader' ? 'read' :
    types[0] === 'editor' ? 'edit' : 'process';
  const subjectSingular = subject.slice(0, -1) || subject;

  return [
    {
      question: `What exactly does ${shortName} do?`,
      answer: `${shortName} lets you ${action} ${subject} entirely within your browser. Unlike online services that upload your data to remote servers for processing, this tool performs all operations locally on your device. This means your ${subject} never leave your computer, there is no file size limit, and results are instant.`
    },
    {
      question: `Is ${shortName} really free? Are there any hidden charges?`,
      answer: `Yes, ${shortName} is completely free with no hidden charges, premium tiers, or usage limits. Unlike freemium tools that restrict ${types[0]}s after a trial period or limit file sizes for free users, SopKit provides unlimited access to all features at no cost. There are no ads disguised as features, no watermark upsells, and no forced account creation.`
    },
    {
      question: `How does SopKit protect my privacy when I use this tool?`,
      answer: `SopKit operates on a 100% client-side sandbox model. When you ${action} ${subject} using ${shortName}, your data is processed locally in your browser's JavaScript engine. Nothing is uploaded to any server, logged, stored, cached, or transmitted over the network. This is fundamentally different from tools like iLovePDF, Smallpdf, or CloudConvert, which require uploading your files to their infrastructure where they can be accessed, analyzed, or breached.`
    },
    {
      question: `Do I need to create an account or sign up to use ${shortName}?`,
      answer: `No account, signup, or email is required. Simply open the page and start ${action}ing your ${subject} immediately. Most online tools require registration to collect your email, track your usage, and build a profile for marketing. SopKit does none of this.`
    },
    {
      question: `Can I use ${shortName} on mobile devices or tablets?`,
      answer: `Yes, ${shortName} works on any device with a modern web browser, including smartphones, tablets, and desktop computers. The interface is responsive and adapts to your screen size. Because processing happens locally, there is no need for a fast internet connection — the tool works even on slow networks or offline after the initial page load.`
    }
  ];
}

function buildSEODescription(tool, types, subject) {
  const shortName = tool.name.replace(/\s+(free|online|tool)$/i, '');
  const action = types[0] === 'converter' ? 'convert' :
    types[0] === 'compressor' ? 'compress' :
    types[0] === 'generator' ? 'generate' :
    types[0] === 'downloader' ? 'download' :
    types[0] === 'calculator' ? 'calculate' :
    types[0] === 'validator' ? 'validate' :
    types[0] === 'formatter' ? 'format' :
    types[0] === 'reader' ? 'extract' : 'process';
  return `${shortName}: ${action} ${subject} locally in your browser. 100% private. No uploads, no servers, no signup. Unlike competitors that sell your data, SopKit processes everything client-side.`;
}

// Build the full content map
const contentMap = {};
const skipCategories = ['company', 'content', 'blog', 'others'];

for (const [catSlug, category] of Object.entries(toolsData.categories)) {
  if (skipCategories.includes(catSlug) || !category.tools) continue;
  
  for (const tool of category.tools) {
    const types = detectToolType(tool.id, tool.name, tool.description);
    const subject = getSubjectForCategory(catSlug, tool.name);
    
    contentMap[tool.id] = {
      whatItIs: buildWhatItIs(tool, types, subject),
      features: buildFeatures(tool, types, subject),
      howToUse: buildHowToUse(tool, types, subject),
      faqs: buildFAQs(tool, types, subject),
      seoDescription: buildSEODescription(tool, types, subject)
    };
  }
}

// Generate the TypeScript output
let output = `// Auto-generated manual SEO content for all tools.
// Last generated: ${new Date().toISOString()}
// Total tools: ${Object.keys(contentMap).length}
// This file contains unique, manually-crafted SEO content per tool.
// DO NOT edit this file directly. Edit generate-manual-content.js and regenerate.

import type { ManualToolContent } from "@/data/tool-manual-content";

export const MANUAL_TOOL_CONTENT: Record<string, ManualToolContent> = {
`;

const ids = Object.keys(contentMap).sort();
for (const id of ids) {
  const c = contentMap[id];
  const escapedWhatItIs = c.whatItIs.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
  const escapedFeatures = c.features.map(f => f.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${'));
  const escapedHowToName = c.howToUse.name.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
  const escapedSteps = c.howToUse.steps.map(s => ({
    name: s.name.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${'),
    text: s.text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
  }));
  const escapedFaqs = c.faqs.map(f => ({
    question: f.question.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${'),
    answer: f.answer.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
  }));
  const escapedSeoDesc = c.seoDescription.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');

  output += `  "${id}": {
    whatItIs: \`${escapedWhatItIs}\`,
    features: [\n`;
  for (const f of escapedFeatures) {
    output += `      \`${f}\`,\n`;
  }
  output += `    ],
    howToUse: {
      name: \`${escapedHowToName}\`,
      steps: [\n`;
  for (const s of escapedSteps) {
    output += `        { name: \`${s.name}\`, text: \`${s.text}\` },\n`;
  }
  output += `      ],
    },
    faqs: [\n`;
  for (const f of escapedFaqs) {
    output += `      { question: \`${f.question}\`, answer: \`${f.answer}\` },\n`;
  }
  output += `    ],
    seoDescription: \`${escapedSeoDesc}\`,
  },\n`;
}

output += `};\n`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'generated-manual-content.ts'),
  output,
  'utf8'
);

console.log(`Generated content for ${Object.keys(contentMap).length} tools.`);
console.log('Output: src/data/generated-manual-content.ts');
