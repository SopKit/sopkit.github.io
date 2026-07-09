import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BackgroundRemoverTool from "@/components/tools/image/BackgroundRemoverTool";

export const metadata = {
	title: "Background Remover Online Free - Compress & Convert Images | SopKit",
	description: "Remove image backgrounds automatically with AI. Create transparent PNGs for product photos, headshots, or graphics instantly. 100% free, browser-based, and no signup needed. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/background-remover/",
	},
	openGraph: {
		title: "Background Remover Online Free - No Signup",
		description: "Remove image backgrounds automatically with AI. Create transparent PNGs for product photos, headshots, or graphics instantly. 100% free, browser-based, and no s",
		url: "https://sopkit.github.io/background-remover/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Background Remover Online Free - Fast & Secure",
		description: "Remove image backgrounds automatically with AI. Create transparent PNGs for product photos, headshots, or graphics instantly. 100% free, browser-based, and no s",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/background-remover");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BackgroundRemoverTool />
		</ToolLayout>
	);
}
