import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Open Graph Checker Online Free - No Signup | SopKit",
	description: "Free open graph checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/open-graph-checker",
	},
	openGraph: {
		title: "Open Graph Checker Online Free - No Signup",
		description: "Free open graph checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/open-graph-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Open Graph Checker Online Free - Fast & Secure",
		description: "Free open graph checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/open-graph-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="open-graph-checker" />
		</ToolLayout>
	);
}
