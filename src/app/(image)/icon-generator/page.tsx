import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaviconGeneratorTool from "@/components/tools/image/FaviconGeneratorTool";

export const metadata = {
	title: "Free Icon Generator Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Icon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "icon generator, free online tool, no signup, icon generator online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/icon-generator",
	},
	openGraph: {
		title: "Free Icon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Icon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/icon-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Icon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Icon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/icon-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaviconGeneratorTool />
		</ToolLayout>
	);
}
