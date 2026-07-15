import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "Free Convert to ICO Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Convert to ICO online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "convert to ico, free online tool, no signup, convert to ico online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/convert-to-ico",
	},
	openGraph: {
		title: "Free Convert to ICO Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Convert to ICO online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/convert-to-ico",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Convert to ICO Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Convert to ICO online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/convert-to-ico");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
