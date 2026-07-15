import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExifReaderTool from "@/components/tools/image/ExifReaderTool";

export const metadata = {
	title: "Free EXIF Reader Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free EXIF Reader online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
	keywords: "exif reader, free online tool, no signup, exif reader online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/exif-reader",
	},
	openGraph: {
		title: "Free EXIF Reader Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free EXIF Reader online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		url: "https://sopkit.github.io/exif-reader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free EXIF Reader Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free EXIF Reader online. Crop, resize, and optimize photos in your browser with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/exif-reader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExifReaderTool />
		</ToolLayout>
	);
}
