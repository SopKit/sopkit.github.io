/**
 * @file src/lib/load-qrcode.ts
 * @description Lazily loads the `qrcode` npm package (node-qrcode) for QR tools.
 *
 * The library is bundled by the app and imported on demand, so no external
 * script is fetched at runtime. This keeps QR generation working under the
 * strict `script-src 'self'` Content-Security-Policy, which blocks CDN <script>
 * tags, and avoids a third-party network dependency entirely.
 */

export interface QrCodeRenderOptions {
	width?: number;
	margin?: number;
	color?: { dark?: string; light?: string };
	errorCorrectionLevel?: "L" | "M" | "Q" | "H";
	type?: "svg" | "utf8" | "terminal";
}

export interface QrCodeLibrary {
	toCanvas(
		canvas: HTMLCanvasElement,
		text: string,
		options?: QrCodeRenderOptions,
	): Promise<HTMLCanvasElement>;
	toCanvas(
		canvas: HTMLCanvasElement,
		text: string,
		options: QrCodeRenderOptions | undefined,
		callback: (error: Error | null | undefined) => void,
	): void;
	toString(text: string, options?: QrCodeRenderOptions): Promise<string>;
	toDataURL(text: string, options?: QrCodeRenderOptions): Promise<string>;
}

let qrCodePromise: Promise<QrCodeLibrary> | null = null;

/**
 * Resolves the QR code library, importing it once and memoizing the result.
 */
export function loadQrCodeLibrary(): Promise<QrCodeLibrary> {
	if (typeof window === "undefined") {
		return Promise.reject(
			new Error("QR generation is only available in a browser"),
		);
	}

	if (!qrCodePromise) {
		qrCodePromise = import("qrcode")
			.then((mod) => (mod.default ?? mod) as unknown as QrCodeLibrary)
			.catch((error) => {
				// Allow a later retry if the chunk failed to load.
				qrCodePromise = null;
				throw error;
			});
	}

	return qrCodePromise;
}
