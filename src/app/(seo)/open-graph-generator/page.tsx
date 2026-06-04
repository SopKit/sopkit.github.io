import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import OpenGraphGenerator from "@/components/tools/built-ins/OpenGraphGenerator";

export const metadata = {
	title: "Open Graph Generator Online Free - No Signup | SopKit",
	description: "Free open graph generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/open-graph-generator",
	},
	openGraph: {
		title: "Open Graph Generator Online Free - No Signup",
		description: "Free open graph generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/open-graph-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Open Graph Generator Online Free - Fast & Secure",
		description: "Free open graph generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/open-graph-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<OpenGraphGenerator />
		</ToolLayout>
	);
}
