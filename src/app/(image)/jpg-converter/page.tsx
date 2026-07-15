import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";

export const metadata = {
	title: "Free JPG Converter Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
	keywords: "jpg converter, free online tool, no signup, jpg converter online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-converter",
	},
	openGraph: {
		title: "Free JPG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		url: "https://sopkit.github.io/jpg-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JPG Converter Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free JPG Converter online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageConverterTool defaultOutputFormat="jpeg" />
		</ToolLayout>
	);
}
