import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Free YouTube Hashtag Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Extractor online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "youtube hashtag extractor, free online tool, no signup, youtube hashtag extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-hashtag-extractor",
	},
	openGraph: {
		title: "Free YouTube Hashtag Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Extractor online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/youtube-hashtag-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Hashtag Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Extractor online. Fast, secure browser-based utility with no registration. Free & secure.",
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
