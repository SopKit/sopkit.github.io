import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free Audio Tools Online - No Signup | SopKit",
	description:
		"Free audio tools including AI text-to-speech, audio format conversion, and audio compression. Generate voiceovers and convert between MP3/WAV/OGG instantly.",
	openGraph: {
		title: "Free Audio Tools Online - No Signup | SopKit",
		description:
			"Free AI text-to-speech, audio conversion, and compression tools. Generate voiceovers and process audio files instantly in your browser.",
		url: buildCanonicalUrl("/audio-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Audio Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Audio Tools Online - No Signup | SopKit",
		description:
			"Free AI text-to-speech, audio conversion, and compression tools. Generate voiceovers and process audio files instantly in your browser.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function AudioToolsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<main className="flex-1">{children}</main>
		</div>
	);
}
