import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BackgroundRemoverTool from "@/components/tools/image/BackgroundRemoverTool";

export const metadata = {
	title: "Free Background Remover Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Background Remover online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
	keywords: "background remover, free online tool, no signup, background remover online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/background-remover",
	},
	openGraph: {
		title: "Free Background Remover Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Background Remover online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
		url: "https://sopkit.github.io/background-remover",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Background Remover Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Background Remover online. Crop, resize, and optimize photos in your browser with no signup. Try it free now.",
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
