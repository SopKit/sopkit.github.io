// src/index.ts
function generate(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true
  } = options;
  if (length < 4 || length > 128) {
    throw new RangeError("Password length must be between 4 and 128");
  }
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numChars = "0123456789";
  const symChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let charPool = "";
  const guaranteedChars = [];
  if (uppercase) {
    charPool += upperChars;
    guaranteedChars.push(upperChars.charAt(Math.floor(Math.random() * upperChars.length)));
  }
  if (lowercase) {
    charPool += lowerChars;
    guaranteedChars.push(lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)));
  }
  if (numbers) {
    charPool += numChars;
    guaranteedChars.push(numChars.charAt(Math.floor(Math.random() * numChars.length)));
  }
  if (symbols) {
    charPool += symChars;
    guaranteedChars.push(symChars.charAt(Math.floor(Math.random() * symChars.length)));
  }
  if (charPool === "") {
    throw new Error("At least one character set option must be enabled");
  }
  const passwordChars = [...guaranteedChars];
  const remainingLength = length - guaranteedChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    passwordChars.push(charPool.charAt(randomIndex));
  }
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }
  return passwordChars.join("");
}
function analyze(password) {
  if (typeof password !== "string") {
    throw new TypeError("Input must be a string");
  }
  const len = password.length;
  if (len === 0) {
    return { score: 0, label: "very-weak", entropy: 0, suggestions: ["Password cannot be empty."] };
  }
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 26;
  const entropy = Math.round(len * (Math.log(poolSize) / Math.log(2)));
  const suggestions = [];
  if (len < 8) {
    suggestions.push("Increase password length to at least 12 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters.");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters.");
  }
  if (!/[0-9]/.test(password)) {
    suggestions.push("Add numeric digits.");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push("Add symbols or special characters.");
  }
  let score = 0;
  let label = "very-weak";
  if (entropy >= 128) {
    score = 4;
    label = "very-strong";
  } else if (entropy >= 60) {
    score = 3;
    label = "strong";
  } else if (entropy >= 36) {
    score = 2;
    label = "moderate";
  } else if (entropy >= 28) {
    score = 1;
    label = "weak";
  }
  return {
    score,
    label,
    entropy,
    suggestions
  };
}
export {
  analyze,
  generate
};
//# sourceMappingURL=index.js.map