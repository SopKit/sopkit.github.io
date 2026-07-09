import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "URL Slug Generator Online Free | SopKit",
	description: "Convert any text into a SEO-friendly URL slug. Perfect for blog posts and web pages. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/slug-generator/",
	},
	openGraph: {
		title: "URL Slug Generator Online Free - No Signup | SopKit",
		description: "Convert any text into a SEO-friendly URL slug. Perfect for blog posts and web pages. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/slug-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "URL Slug Generator Online Free - Fast & Secure",
		description: "Convert any text into a SEO-friendly URL slug. Perfect for blog posts and web pages. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/slug-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
