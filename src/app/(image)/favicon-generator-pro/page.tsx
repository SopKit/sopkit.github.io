import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Advanced Favicon Generator Online Free | SopKit",
	description: "Create all required favicon sizes and formats (ICO, PNG, SVG) for modern web projects from one image. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/favicon-generator-pro/",
	},
	openGraph: {
		title: "Advanced Favicon Generator Online Free - No Signup | SopKit",
		description: "Create all required favicon sizes and formats (ICO, PNG, SVG) for modern web projects from one image. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/favicon-generator-pro/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Advanced Favicon Generator Online Free - Fast & Secure",
		description: "Create all required favicon sizes and formats (ICO, PNG, SVG) for modern web projects from one image. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/favicon-generator-pro");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
