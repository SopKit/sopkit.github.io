import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML Minifier Online - Compress HTML Code | SopKit",
	description: "Compress and minify your HTML code instantly. Remove comments, redundant whitespace, and reduce page size to improve SEO and load speeds. Private & secure.",
	alternates: {
		canonical: "https://sopkit.github.io/html-minifier/",
	},
	openGraph: {
		title: "Free HTML Minifier Online - Compress HTML Code | SopKit",
		description: "Compress and minify your HTML code instantly. Remove comments, redundant whitespace, and reduce page size to improve SEO and load speeds. Private & secure.",
		url: "https://sopkit.github.io/html-minifier/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML Minifier Online - Compress HTML Code | SopKit",
		description: "Compress and minify your HTML code instantly. Remove comments, redundant whitespace, and reduce page size to improve SEO and load speeds. Private & secure.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
