import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YouTubeDownloader from "@/components/tools/downloaders/YouTubeDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free YouTube Title Extractor Online - No Signup | SopKit",
	description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool.",
	keywords: "youtube title extractor, free online tool, no signup, youtube-title-extractor, free youtube-title-extractor, Youtube Title Extractor online, YouTube tool, free YouTube utility, YouTube optimizer, video analytics, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-extractor",
	},
	openGraph: {
		title: "Free YouTube Title Extractor Online - No Signup | SopKit",
		description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool.",
		url: "https://sopkit.github.io/youtube-title-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Title Extractor Online - No Signup | SopKit",
		description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<YouTubeDownloader />
		</ToolLayout>
	);
}
