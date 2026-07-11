/**
 * SopKit XML Utilities
 * Premium, zero-dependency XML parser, formatter, validator, and minifier.
 * Link: https://sopkit.github.io/xml-formatter/
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates whether the given string is a valid XML representation.
 * Supports DOMParser in browsers and falling back to a structured tag checker in Node.js.
 */
export function validate(xml: string): ValidationResult {
  if (typeof xml !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (xml.trim() === "") {
    return { valid: false, error: "Input cannot be empty" };
  }

  // 1. Browser Environment Strict Validation
  if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        return { valid: false, error: errorNode.textContent || "XML parsing error" };
      }
      return { valid: true };
    } catch (e: any) {
      return { valid: false, error: e.message || "XML parsing error" };
    }
  }

  // 2. Node.js Environment Struct Tag Validation
  try {
    const stack: string[] = [];
    const tagReg = /<(\/?[a-zA-Z0-9:_.-]+)(\s+[^>]*)?\/?>/g;
    let match;

    const cleanXml = xml
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "")
      .replace(/<\?xml[\s\S]*?\?>/g, "");

    let tagCount = 0;

    while ((match = tagReg.exec(cleanXml)) !== null) {
      const tag = match[1];
      const isClosing = tag.startsWith("/");
      const isSelfClosing = match[0].endsWith("/>") || tag.startsWith("?");

      if (isSelfClosing) continue;

      if (!isClosing) {
        tagCount++;
        stack.push(tag);
      } else {
        const opening = stack.pop();
        const expected = tag.slice(1);
        if (!opening || opening !== expected) {
          return { valid: false, error: `Mismatched closing tag: </${expected}>. Expected: </${opening || "none"}>` };
        }
      }
    }

    if (stack.length > 0) {
      return { valid: false, error: `Unclosed XML tags: ${stack.join(", ")}` };
    }

    if (tagCount === 0) {
      return { valid: false, error: "No XML elements found" };
    }

    return { valid: true };
  } catch (e: any) {
    return { valid: false, error: e.message };
  }
}

/**
 * Formats (beautifies) an XML string with customizable indentation.
 */
export function format(xml: string, indentSize = 2): string {
  const validation = validate(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }

  let cleanXml = xml.replace(/>\s*</g, "><").trim();
  let formatted = "";
  let pad = 0;
  const indent = " ".repeat(indentSize);

  cleanXml = cleanXml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3");

  const lines = cleanXml.split("\r\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let indentLevel = 0;
    if (line.match(/.+<\/\w[^>]*>$/)) {
      indentLevel = 0;
    } else if (line.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      indentLevel = 1;
    } else {
      indentLevel = 0;
    }

    const padding = indent.repeat(pad);
    formatted += padding + line + "\n";
    pad += indentLevel;
  }

  return formatted.trim();
}

/**
 * Minifies an XML string by stripping spaces between tags and comments.
 */
export function minify(xml: string): string {
  const validation = validate(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  return xml
    .replace(/>\s*</g, "><")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}
