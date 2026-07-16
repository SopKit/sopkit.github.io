import ToolLayout from "@/components/tools/shared/ToolLayout";
import RedditDownloader from "@/components/tools/downloaders/RedditDownloader";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Reddit Downloader",
	description: "Private Reddit Downloader: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/reddit-downloader",
	category: "video",
});

export default async function ToolPage() {
	const tool = {
		id: "reddit-downloader",
		name: "Reddit Video Downloader",
		description:
			"Download Reddit videos with audio in HD quality - 100% free, no signup required, privacy-focused processing in your browser.",
		route: "/reddit-downloader",
		extraSlugs: [
			"reddit-hd-video-downloader",
			"reddit-media-saver",
		],
		popular: true,
		category: "downloaders",
		features: [
			"Download public Reddit videos with audio",
			"Works on desktop and mobile browsers",
			"No signup required",
		],
		article: `
## Download Reddit Videos Responsibly

This tool allows you to download publicly available Reddit videos for personal use. Please respect copyright and intellectual property rights when using this service.

### Important Guidelines
- Only download videos you own or have permission to download
- Do not redistribute downloaded content without authorization
- Respect the original creators' rights and attributions

### Supported Content
- Public Reddit posts with video
- Videos where the creator has explicitly permitted downloads
- Your own Reddit content

### Privacy Note
Video URLs are processed temporarily for retrieval. We do not store or log downloaded content.
		`,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "Reddit Video Downloader",
						description:
							"Download Reddit videos with audio in HD quality",
						url: "https://sopkit.github.io/reddit-downloader/",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>

			<ToolLayout breadcrumbs={[]} tool={tool}>
				<RedditDownloader />
			</ToolLayout>
		</>
	);
}