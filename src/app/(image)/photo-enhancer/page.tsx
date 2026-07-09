import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoEnhancerTool from "@/components/tools/image/PhotoEnhancerTool";

export const metadata = {
	title: "Photo Enhancer Online Free - Compress & Convert Images | SopKit",
	description: "Enhance photo quality with AI-powered image enhancement No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/photo-enhancer/",
	},
	openGraph: {
		title: "Photo Enhancer Online Free - No Signup",
		description: "Enhance photo quality with AI-powered image enhancement No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/photo-enhancer/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Photo Enhancer Online Free - Fast & Secure",
		description: "Enhance photo quality with AI-powered image enhancement No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-enhancer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoEnhancerTool />
		</ToolLayout>
	);
}
