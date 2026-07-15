import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";


export const metadata = {
	title: "Free Resize Image in CM, MM, Inches Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Resize Image in CM, MM, Inches online. Crop, resize, and optimize photos in your browser with no signup.",
	keywords: "resize image in cm, mm, inches, free online tool, no signup, resize image in cm, mm, inches online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/resize-image-cm-mm-inch",
	},
	openGraph: {
		title: "Free Resize Image in CM, MM, Inches Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Resize Image in CM, MM, Inches online. Crop, resize, and optimize photos in your browser with no signup.",
		url: "https://sopkit.github.io/resize-image-cm-mm-inch",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Resize Image in CM, MM, Inches Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Resize Image in CM, MM, Inches online. Crop, resize, and optimize photos in your browser with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/resize-image-cm-mm-inch");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResizeImageCm />
		</ToolLayout>
	);
}
