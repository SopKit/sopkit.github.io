let qrCodePromise: Promise<any> | null = null;

const QR_CODE_SOURCES = [
  "https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js",
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js",
] as const;

declare global {
  interface Window {
    QRCode?: any;
  }
}

function loadScript(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-sopkit-qrcode="${src}"]`);
    if (existing) {
      if (window.QRCode) { resolve(window.QRCode); return; }
      existing.addEventListener("load", () => resolve(window.QRCode));
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.sopkitQrcode = src;
    script.onload = () => {
      if (window.QRCode) resolve(window.QRCode);
      else reject(new Error("QRCode library loaded without exposing QRCode"));
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function loadQrCodeLibrary(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("QR generation is only available in a browser"));
  if (window.QRCode) return Promise.resolve(window.QRCode);
  if (qrCodePromise) return qrCodePromise;

  qrCodePromise = (async () => {
    let lastError: unknown;
    for (const source of QR_CODE_SOURCES) {
      try {
        const library = await Promise.race([
          loadScript(source),
          new Promise((_, reject) => window.setTimeout(() => reject(new Error("QR library request timed out")), 8000)),
        ]);
        return library;
      } catch (error) { lastError = error; }
    }
    qrCodePromise = null;
    throw lastError instanceof Error ? lastError : new Error("Unable to load the QR code generator");
  })();
  return qrCodePromise;
}