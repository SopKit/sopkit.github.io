// src/index.ts
function slugify(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }
  const {
    separator = "-",
    lowercase = true,
    strict = true
  } = options;
  let str = text;
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lowercase) {
    str = str.toLowerCase();
  }
  if (strict) {
    str = str.replace(/[^a-z0-9\s-_]/gi, "");
  }
  str = str.trim().replace(/\s+/g, separator).replace(new RegExp(`\\${separator}+`, "g"), separator);
  if (str.startsWith(separator)) {
    str = str.slice(separator.length);
  }
  if (str.endsWith(separator)) {
    str = str.slice(0, -separator.length);
  }
  return str;
}
function isValid(slug, separator = "-") {
  if (typeof slug !== "string" || slug.trim() === "") {
    return false;
  }
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`^[a-z0-9]+(${escapedSeparator}[a-z0-9]+)*$`, "i");
  return regex.test(slug);
}
export {
  isValid,
  slugify
};
//# sourceMappingURL=index.js.map