"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EmbedPlayer from "@/components/embed/EmbedPlayer";

function EmbedContent() {
	const searchParams = useSearchParams();
	const playerParam = searchParams.get("player") || "plyr";
	const videoId = searchParams.get("id") || searchParams.get("videoId") || "";

	// allowed player engines
	const allowed = new Set(["plyr", "videojs", "fluid", "mediaelement"]);
	const engine = allowed.has(playerParam) ? playerParam : "plyr";

	if (!videoId) {
		return (
			<div className="text-center p-4">
				<p className="text-sm text-muted-foreground">No video ID provided. Use /embed/?id=VIDEO_ID</p>
			</div>
		);
	}

	return (
		<div style={{ width: "100%", height: "100vh", padding: 0, margin: 0 }} className="flex items-center justify-center bg-black">
			<EmbedPlayer player={engine} videoId={videoId} />
		</div>
	);
}

export default function EmbedPage() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-screen bg-black">
				<div className="text-white">Loading player...</div>
			</div>
		}>
			<EmbedContent />
		</Suspense>
	);
}
