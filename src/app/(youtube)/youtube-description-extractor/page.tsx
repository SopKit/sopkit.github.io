import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "YouTube Description Extractor Online Free - No Signup | SopKit",
	description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-description-extractor",
	},
	openGraph: {
		title: "YouTube Description Extractor Online Free - No Signup",
		description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool",
		url: "https://sopkit.github.io/youtube-description-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Description Extractor Online Free - Fast & Secure",
		description: "Extract the full description from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool",
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
			<DownloaderEngine />
		</ToolLayout>
	);
}
