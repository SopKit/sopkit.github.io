import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResizeImageCm from "@/components/tools/image/ResizeImageCm";


export const metadata = {
	title: "Resize Image in CM, MM, Inches Online Free | SopKit",
	description: "Resize photos by centimeters, millimeters, inches, pixels, and DPI for official forms, printing, and documents. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/resize-image-cm-mm-inch",
	},
	openGraph: {
		title: "Resize Image in CM, MM, Inches Online Free - No Signup | SopKit",
		description: "Resize photos by centimeters, millimeters, inches, pixels, and DPI for official forms, printing, and documents. No signup, no uploads, 100% private browser-base",
		url: "https://sopkit.github.io/resize-image-cm-mm-inch",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Resize Image in CM, MM, Inches Online Free - Fast & Secure",
		description: "Resize photos by centimeters, millimeters, inches, pixels, and DPI for official forms, printing, and documents. No signup, no uploads, 100% private browser-base",
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
