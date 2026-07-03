// src/index.ts
function v4() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return ("10000000-1000-4000-8000" + -1e11).replace(
      /[018]/g,
      (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function v1() {
  let d = (/* @__PURE__ */ new Date()).getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function validate(uuid) {
  if (typeof uuid !== "string") {
    return false;
  }
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
function getVersion(uuid) {
  if (!validate(uuid)) {
    return null;
  }
  return parseInt(uuid.charAt(14), 10);
}
export {
  getVersion,
  v1,
  v4,
  validate
};
//# sourceMappingURL=index.js.map