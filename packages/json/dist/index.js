// src/index.ts
function validate(jsonStr) {
  if (typeof jsonStr !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (jsonStr.trim() === "") {
    return { valid: false, error: "Input string is empty" };
  }
  try {
    const data = JSON.parse(jsonStr);
    return { valid: true, data };
  } catch (e) {
    const message = e.message;
    let line = void 0;
    let column = void 0;
    const lineMatch = message.match(/line\s+(\d+)/i);
    const colMatch = message.match(/column\s+(\d+)/i);
    const posMatch = message.match(/position\s+(\d+)/i);
    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (colMatch) column = parseInt(colMatch[1], 10);
    if (posMatch && !line && !column) {
      const pos = parseInt(posMatch[1], 10);
      const linesBefore = jsonStr.slice(0, pos).split("\n");
      line = linesBefore.length;
      column = linesBefore[linesBefore.length - 1].length + 1;
    }
    return {
      valid: false,
      error: message,
      line,
      column
    };
  }
}
function format(jsonStr, options = {}) {
  const { space = 2 } = options;
  const validation = validate(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data, null, space);
}
function minify(jsonStr) {
  const validation = validate(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data);
}
export {
  format,
  minify,
  validate
};
//# sourceMappingURL=index.js.map