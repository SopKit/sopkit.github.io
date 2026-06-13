import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "IndexNow Submitter Online Free - No Signup | SopKit",
	description: "Submit URLs to Bing, Yandex, and other search engines instantly using the IndexNow protocol. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/indexnow",
	},
	openGraph: {
		title: "IndexNow Submitter Online Free - No Signup",
		description: "Submit URLs to Bing, Yandex, and other search engines instantly using the IndexNow protocol. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/indexnow",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "IndexNow Submitter Online Free - Fast & Secure",
		description: "Submit URLs to Bing, Yandex, and other search engines instantly using the IndexNow protocol. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/indexnow");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="indexnow-submitter" />
		</ToolLayout>
	);
}
