export function extractYouTubeId(url: string | null | undefined): string | null {
	if (!url || typeof url !== "string") return null;
	// Common YouTube URL formats
	const patterns = [
		/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/i,
		/https?:\/\/(?:www\.)?youtube\.com\/embed\/([\w-]{11})/i,
		/https?:\/\/(?:www\.)?youtu\.be\/([\w-]{11})/i,
		/https?:\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]{11})/i,
	];

	for (const p of patterns) {
		const m = url.match(p);
		if (m?.[1]) return m[1];
	}

	// If URL contains a v= param but additional params after, attempt to parse
	try {
		const u = new URL(url);
		const v = u.searchParams.get("v");
		if (v && v.length >= 11) return v.substring(0, 11);
	} catch {
		// ignore invalid URL parsing
	}

	// fallback: last 11 characters if they match allowed chars
	const last = url.slice(-11);
	if (/^[\w-]{11}$/.test(last)) return last;

	return null;
}

export function extractYouTubePlaylistId(url: string | null | undefined): string | null {
	if (!url || typeof url !== "string") return null;

	const patterns = [
		/https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/i,
		/https?:\/\/(?:www\.)?youtube\.com\/watch\?.*?list=([A-Za-z0-9_-]+)/i,
		/^([A-Za-z0-9_-]{16,})$/,
	];

	for (const p of patterns) {
		const m = url.match(p);
		if (m?.[1]) return m[1];
	}

	try {
		const u = new URL(url);
		const list = u.searchParams.get("list");
		if (list) return list;
	} catch {
		// ignore invalid URL parsing
	}

	return null;
}
