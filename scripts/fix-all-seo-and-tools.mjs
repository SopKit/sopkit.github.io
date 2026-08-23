import fs from "fs";
import path from "path";

const toolsPath = "src/constants/tools.json";
const toolsData = JSON.parse(fs.readFileSync(toolsPath, "utf8"));

function expandDescription(tool) {
  let desc = (tool.description || "").trim();
  const name = tool.name;

  if (desc.length >= 100) return desc;

  // Specific high-quality enhancements for thin descriptions
  if (tool.id === "excuse-generator") {
    return "Generate creative, believable, and humorous excuses for work, school, social events, and meetings instantly in your browser.";
  }
  if (tool.id === "font-generator") {
    return "Transform plain text into stylish Unicode fonts, cursive scripts, and aesthetic typography for Instagram, Twitter, and Discord.";
  }
  if (tool.id === "bio-generator") {
    return "Create compelling, aesthetic social media bios and profile elevator pitches tailored for Instagram, Twitter/X, TikTok, and LinkedIn.";
  }
  if (tool.id === "ai-poem-generator") {
    return "Generate expressive poems, haikus, rhyming verses, and sonnets across different moods and themes using intelligent text patterns.";
  }
  if (tool.id === "fake-chat-generator") {
    return "Create realistic-looking fake chat screenshots for WhatsApp, Discord, and iMessage with customizable profiles, timestamps, and messages.";
  }
  if (tool.id === "url-shortener") {
    return "Shorten long web URLs into compact, easily shareable links for social media, marketing campaigns, and messages with zero tracking.";
  }
  if (tool.id === "password-generator") {
    return "Generate cryptographically secure, random passwords with custom lengths, symbols, numbers, and uppercase characters locally on your device.";
  }
  if (tool.id === "code-formatter") {
    return "Beautify, format, and indent HTML, CSS, JavaScript, JSON, and SQL source code cleanly with customizable tab indentation.";
  }
  if (tool.id === "css-gradient-generator") {
    return "Design smooth linear, radial, and conic CSS gradients with live visual preview, color stop controls, and ready-to-copy code snippets.";
  }
  if (tool.id === "css-shadow-generator") {
    return "Generate modern CSS box-shadows, elevation layers, and text-shadow effects with visual sliders and instant CSS code output.";
  }
  if (tool.id === "seotoolkit") {
    return "Comprehensive all-in-one technical SEO audit and website analysis tool covering meta tags, performance headers, mobile viewports, and links.";
  }
  if (tool.id === "photo-name-date-editor") {
    return "Add custom applicant name and date of photograph stamps onto exam application photos according to official recruitment standards.";
  }
  if (tool.id === "pdf-compressor-under-200kb") {
    return "Compress PDF documents under 200KB for government job portals, university admissions, and exam application uploads without losing text clarity.";
  }
  if (tool.id === "photo-compressor-under-50kb") {
    return "Compress application photos under 50KB for online exam portals, job applications, and official government registration forms.";
  }
  if (tool.id === "jpg-to-pdf-exam-forms") {
    return "Convert scanned JPG photos, signatures, and certificates into a single, compact PDF document optimized for online exam submissions.";
  }
  if (tool.id.endsWith("-api-key-tester")) {
    const serviceName = name.replace(" API Key Tester", "").replace(" Server Token Tester", "");
    return `Safely validate your ${serviceName} API credentials and test endpoint connectivity in real-time with 100% client-side browser execution.`;
  }
  if (tool.id.startsWith("url-")) {
    const action = name.replace("URL ", "");
    return `Fast and privacy-conscious ${name} to ${action.toLowerCase()} web links and URI parameters directly in your browser with no server logging.`;
  }
  if (desc.startsWith("Generate optimized") && desc.endsWith("Instantly copy or share customized outputs.")) {
    const cleanSubject = name.replace(" Generator", "");
    return `Generate high-converting, customized ${cleanSubject.toLowerCase()} ideas, copy, and templates. Easily customize and copy results in one click.`;
  }

  // General fallback extension
  if (!desc.endsWith(".")) desc += ".";
  desc += " Fast, 100% private client-side processing with zero file uploads and no registration required.";
  return desc;
}

function generateSeoDescription(tool) {
  if (tool.seoDescription && tool.seoDescription.length >= 100) return tool.seoDescription;

  const name = tool.name.replace(/\s+(online|free)$/i, "").trim();
  const desc = tool.description || "";

  if (tool.id.endsWith("-api-key-tester")) {
    const serviceName = name.replace(" API Key Tester", "");
    return `Free ${name} online: securely validate ${serviceName} credentials and test API endpoints in your browser. 100% private client-side execution.`;
  }

  if (tool.category === "privacy-tools" || tool.id.includes("checker") || tool.id.includes("detector") || tool.id.includes("scrubber") || tool.id.includes("validator")) {
    return `Free ${name} online: analyze, check, and secure data in your browser. 100% private client-side processing with zero server uploads or tracking.`;
  }

  if (tool.category === "generators" || tool.id.includes("generator")) {
    return `Free ${name} online: generate custom templates, copy, and assets instantly. 100% private in-browser processing with zero account signups.`;
  }

  return `Free ${name} online: fast, secure, and easy to use in your browser. 100% client-side processing with zero file uploads and no account needed.`;
}

let updatedDescCount = 0;
let updatedSeoDescCount = 0;

for (const [catKey, catObj] of Object.entries(toolsData.categories)) {
  for (const tool of (catObj.tools || [])) {
    const origDesc = tool.description || "";
    if (origDesc.length < 100) {
      tool.description = expandDescription(tool);
      updatedDescCount++;
    }

    if (!tool.seoDescription || tool.seoDescription.length < 100) {
      tool.seoDescription = generateSeoDescription(tool);
      updatedSeoDescCount++;
    }
  }
}

fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), "utf8");
console.log(`✅ Updated ${updatedDescCount} thin descriptions and ${updatedSeoDescCount} seoDescriptions in tools.json!`);
