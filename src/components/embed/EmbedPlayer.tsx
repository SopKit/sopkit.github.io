"use client";

import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import {
	sanitizeEmbedStart,
	sanitizeYouTubeVideoId,
} from "@/lib/embed-safety";

export default function EmbedPlayer({ player, videoId }) {
	const searchParams = useSearchParams();
	const autoplay = searchParams?.get("autoplay") === "1";
	const _loop = searchParams?.get("loop") === "1";
	const controls = searchParams?.get("controls") !== "0";
	const _theme = searchParams?.get("theme") || "dark";
	// videoId and start both come from the page URL. They are
	// normalized before interpolation: a raw videoId containing / ? &
	// would escape the video-ID slot of the iframe path, and a raw
	// start value could inject extra query parameters. React
	// attribute escaping already prevents a markup breakout here;
	// this normalization closes the URL-smuggling remainder (see
	// src/lib/embed-safety.ts and scripts/validate-embed-safety.ts).
	const safeVideoId = sanitizeYouTubeVideoId(videoId);
	const start = sanitizeEmbedStart(searchParams?.get("start") || "0");

	useEffect(() => {
		// Nothing fancy: For now, we just leave the page to render an iframe
		// If advanced player integration is required, dynamic imports and
		// initialization of player libraries can be added here.
	}, []);

	const src = `https://www.youtube.com/embed/${safeVideoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&start=${start}&rel=0`;

	// A video ID that sanitizes to empty names no video: render a
	// fallback instead of an iframe pointed at a bare /embed/ path.
	if (!safeVideoId) {
		return (
			<div style={{ width: "100%", maxWidth: "1280px" }}>
				<div className="text-center p-4">
					<p className="text-sm text-muted-foreground">Invalid video ID provided</p>
				</div>
			</div>
		);
	}

	// Render the appropriate player wrapper: For now, use an iframe wrapper
	// with minimal chrome, allowing the chosen player's scripts to be loaded
	return (
		<div style={{ width: "100%", maxWidth: "1280px" }}>
			{/* Load the player CDN only if necessary. Use the player's own wrappers later. */}
			{player === "plyr" && (
				<Script
					src="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.min.js"
					strategy="beforeInteractive"
				/>
			)}
			{player === "videojs" && (
				<Script
					src="https://vjs.zencdn.net/8.2.4/video.min.js"
					strategy="beforeInteractive"
				/>
			)}
			{player === "fluid" && (
				<Script
					src="https://cdn.jsdelivr.net/npm/fluid-player@6.3.0/dist/fluidplayer.min.js"
					strategy="beforeInteractive"
				/>
			)}
			{player === "mediaelement" && (
				<Script
					src="https://cdn.jsdelivr.net/npm/mediaelement@4.2.16/build/mediaelement-and-player.min.js"
					strategy="beforeInteractive"
				/>
			)}

			{/* Basic iframe fallback — fully responsive */}
			<div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
				<iframe
					src={src}
					title={`embedded-${safeVideoId}`}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
					}}
					frameBorder="0"
					allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
					allowFullScreen
				/>
			</div>
		</div>
	);
}
