import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONMinifierTool from "@/components/tools/developer/JSONMinifierTool";

export const metadata = {
	title: "JSON Minify Online Free - Developer Tools | SopKit",
	description: "Compress and minify your JSON data to reduce its size for web transmission. Our free online tool removes all unnecessary whitespace and comments instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-minify",
	},
	openGraph: {
		title: "JSON Minify Online Free - No Signup",
		description: "Compress and minify your JSON data to reduce its size for web transmission. Our free online tool removes all unnecessary whitespace and comments instantly. No s",
		url: "https://sopkit.github.io/json-minify",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON Minify Online Free - Fast & Secure",
		description: "Compress and minify your JSON data to reduce its size for web transmission. Our free online tool removes all unnecessary whitespace and comments instantly. No s",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-minify");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONMinifierTool />
		</ToolLayout>
	);
}
