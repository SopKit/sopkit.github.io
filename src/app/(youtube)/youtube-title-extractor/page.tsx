import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "YouTube Title Extractor Online Free - No Signup | SopKit",
	description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-extractor",
	},
	openGraph: {
		title: "YouTube Title Extractor Online Free - No Signup",
		description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool. No ",
		url: "https://sopkit.github.io/youtube-title-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Title Extractor Online Free - Fast & Secure",
		description: "Extract the exact title from any YouTube video instantly. Perfect for competitor research, SEO analysis, and content archiving. Free and secure online tool. No ",
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
			<DownloaderEngine />
		</ToolLayout>
	);
}
