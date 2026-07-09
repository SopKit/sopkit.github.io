import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonFormatterTool from "@/components/tools/code/JsonFormatterTool";

export const metadata = {
	title: "JSON Viewer Online Free - Developer Tools | SopKit",
	description: "Free json viewer tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-viewer/",
	},
	openGraph: {
		title: "JSON Viewer Online Free - No Signup",
		description: "Free json viewer tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/json-viewer/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON Viewer Online Free - Fast & Secure",
		description: "Free json viewer tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-viewer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JsonFormatterTool />
		</ToolLayout>
	);
}
