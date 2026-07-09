import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Pro Image Color Picker Online Free | SopKit",
	description: "Extract HEX, RGB, and HSL color codes from any image with our interactive pixel-perfect picker. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/image-color-picker",
	},
	openGraph: {
		title: "Pro Image Color Picker Online Free - No Signup | SopKit",
		description: "Extract HEX, RGB, and HSL color codes from any image with our interactive pixel-perfect picker. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/image-color-picker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Pro Image Color Picker Online Free - Fast & Secure",
		description: "Extract HEX, RGB, and HSL color codes from any image with our interactive pixel-perfect picker. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/image-color-picker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
