import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "YouTube Hashtag Extractor Online Free - No Signup | SopKit",
	description: "Extract all hashtags from any YouTube video instantly. Our free online tool helps you analyze competitor tagging strategies and optimize your own video SEO for better reach. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-hashtag-extractor",
	},
	openGraph: {
		title: "YouTube Hashtag Extractor Online Free - No Signup",
		description: "Extract all hashtags from any YouTube video instantly. Our free online tool helps you analyze competitor tagging strategies and optimize your own video SEO for ",
		url: "https://sopkit.github.io/youtube-hashtag-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Hashtag Extractor Online Free - Fast & Secure",
		description: "Extract all hashtags from any YouTube video instantly. Our free online tool helps you analyze competitor tagging strategies and optimize your own video SEO for ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-hashtag-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
