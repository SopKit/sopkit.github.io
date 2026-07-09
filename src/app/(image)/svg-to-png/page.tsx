import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "SVG to PNG Converter Online Free | SopKit",
	description: "Convert scalable vector graphics (SVG) into high-quality PNG images with transparent backgrounds. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/svg-to-png/",
	},
	openGraph: {
		title: "SVG to PNG Converter Online Free - No Signup | SopKit",
		description: "Convert scalable vector graphics (SVG) into high-quality PNG images with transparent backgrounds. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/svg-to-png/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SVG to PNG Converter Online Free - Fast & Secure",
		description: "Convert scalable vector graphics (SVG) into high-quality PNG images with transparent backgrounds. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/svg-to-png");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
