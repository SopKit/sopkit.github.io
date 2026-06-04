import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YouTubeDownloader from "@/components/tools/downloaders/YouTubeDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free YouTube Description Extractor Online - No Signup | SopKit",
	description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure...",
	keywords: "youtube description extractor, free online tool, no signup, youtube-description-extractor, free youtube-description-extractor, Youtube Description Extractor online, YouTube tool, free YouTube utility, YouTube optimizer, video analytics, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-description-extractor",
	},
	openGraph: {
		title: "Free YouTube Description Extractor Online - No Signup | SopKit",
		description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure...",
		url: "https://sopkit.github.io/youtube-description-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Description Extractor Online - No Signup | SopKit",
		description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-description-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<YouTubeDownloader />
		</ToolLayout>
	);
}
