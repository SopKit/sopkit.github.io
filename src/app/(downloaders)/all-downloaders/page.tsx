import AllDownloaders from "@/components/tools/downloaders/AllDownloaders";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "All Downloaders",
	description: "Private All Downloaders: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/all-downloaders",
	category: "video",
});

export default async function ToolPage() {
	const tool = {
		id: "all-downloaders",
		name: "All Downloaders",
		description: "All Downloaders",
		route: "/all-downloaders",
		extraSlugs: [],
		popular: false,
		category: "others",
	};
	const breadcrumbs = [
		{
			name: "Others Tools",
			url: "/others-tools",
		},
		{
			name: "All Downloaders",
			url: "/all-downloaders",
		},
	];
	const relatedTools = [
		{
			id: "ai-video-summarizer",
			name: "AI Video Summarizer",
			description: "Summarize video transcripts into key points and insights using intelligent text analysis. Free and private.",
			route: "/ai-video-summarizer",
			extraSlugs: [],
			popular: true,
			category: "video",
		},
		{
			id: "audio-equalizer",
			name: "Audio Equalizer",
			description: "Adjust audio frequencies with a 10-band graphic equalizer. Choose from presets like Rock, Pop, Jazz, and more.",
			route: "/audio-equalizer",
			extraSlugs: [
				"audio-tools",
				"audio-trimmer",
				"change-audio-format",
				"mp4-audio-ripper",
				"optimize-audio-files",
				"shorten-audio-clip",
				"split-audio-file",
			],
			popular: true,
			category: "audio",
		},
		{
			id: "audio-joiner",
			name: "Audio Joiner",
			description: "Join multiple audio files into a single seamless track. Combine MP3, WAV, OGG, and M4A files. Free and private.",
			route: "/audio-joiner",
			extraSlugs: [],
			popular: true,
			category: "audio",
		},
	];

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "All Downloaders",
						description: "All Downloaders",
						url: "https://sopkit.github.io/all-downloaders/",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>

			<ToolLayout breadcrumbs={[]}
				tool={tool}
				breadcrumbs={breadcrumbs}
				relatedTools={relatedTools}
			>
				<AllDownloaders />
			</ToolLayout>
		</>
	);
}
