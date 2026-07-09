import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "YouTube Tag Extractor Online Free - No Signup | SopKit",
	description: "Extract hidden tags from any YouTube video instantly. Our free online tool helps you discover the keywords used by top-performing creators to boost your own video SEO. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-tag-extractor/",
	},
	openGraph: {
		title: "YouTube Tag Extractor Online Free - No Signup",
		description: "Extract hidden tags from any YouTube video instantly. Our free online tool helps you discover the keywords used by top-performing creators to boost your own vid",
		url: "https://sopkit.github.io/youtube-tag-extractor/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Tag Extractor Online Free - Fast & Secure",
		description: "Extract hidden tags from any YouTube video instantly. Our free online tool helps you discover the keywords used by top-performing creators to boost your own vid",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-tag-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
