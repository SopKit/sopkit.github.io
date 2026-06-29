import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageResizerTool from "@/components/tools/image/ImageResizerTool";

export const metadata = {
	title: "Rotate Image Online Free - Compress & Convert Images | SopKit",
	description: "Rotate images clockwise, counter-clockwise, or flip them instantly. Our free online image rotator works in your browser, keeping your photos private and secure. No signup needed. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/rotate-image/",
	},
	openGraph: {
		title: "Rotate Image Online Free - No Signup",
		description: "Rotate images clockwise, counter-clockwise, or flip them instantly. Our free online image rotator works in your browser, keeping your photos private and secure.",
		url: "https://sopkit.github.io/rotate-image",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Rotate Image Online Free - Fast & Secure",
		description: "Rotate images clockwise, counter-clockwise, or flip them instantly. Our free online image rotator works in your browser, keeping your photos private and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rotate-image");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageResizerTool />
		</ToolLayout>
	);
}
