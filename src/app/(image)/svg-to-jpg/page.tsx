import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "SVG to JPG Converter Online Free | SopKit",
	description: "Convert SVG vector files into standard JPG images with custom background colors. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/svg-to-jpg",
	},
	openGraph: {
		title: "SVG to JPG Converter Online Free - No Signup | SopKit",
		description: "Convert SVG vector files into standard JPG images with custom background colors. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/svg-to-jpg/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SVG to JPG Converter Online Free - Fast & Secure",
		description: "Convert SVG vector files into standard JPG images with custom background colors. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/svg-to-jpg");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
