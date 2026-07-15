import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaviconGeneratorTool from "@/components/tools/image/FaviconGeneratorTool";

export const metadata = {
	title: "Free Favicon Generator Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
	keywords: "favicon generator, free online tool, no signup, favicon generator online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/favicon-generator",
	},
	openGraph: {
		title: "Free Favicon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
		url: "https://sopkit.github.io/favicon-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Favicon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. No signup required.",
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
