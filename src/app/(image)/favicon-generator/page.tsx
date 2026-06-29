import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaviconGeneratorTool from "@/components/tools/image/FaviconGeneratorTool";

export const metadata = {
	title: "Favicon Generator Online Free - Compress & Convert Images | SopKit",
	description: "Generate favicons from text, images, or emojis for websites No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/favicon-generator/",
	},
	openGraph: {
		title: "Favicon Generator Online Free - No Signup",
		description: "Generate favicons from text, images, or emojis for websites No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/favicon-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Favicon Generator Online Free - Fast & Secure",
		description: "Generate favicons from text, images, or emojis for websites No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/favicon-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaviconGeneratorTool />
		</ToolLayout>
	);
}
