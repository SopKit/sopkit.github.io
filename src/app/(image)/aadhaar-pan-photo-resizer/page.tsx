import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";


export const metadata = {
	title: "Free Aadhaar and PAN Card Photo Resizer Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Aadhaar and PAN Card Photo Resizer online. Crop, resize, and optimize photos in your browser with no signup.",
	keywords: "aadhaar and pan card photo resizer, free online tool, no signup, aadhaar and pan card photo resizer online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/aadhaar-pan-photo-resizer",
	},
	openGraph: {
		title: "Free Aadhaar and PAN Card Photo Resizer Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Aadhaar and PAN Card Photo Resizer online. Crop, resize, and optimize photos in your browser with no signup.",
		url: "https://sopkit.github.io/aadhaar-pan-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Aadhaar and PAN Card Photo Resizer Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Aadhaar and PAN Card Photo Resizer online. Crop, resize, and optimize photos in your browser with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/aadhaar-pan-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
