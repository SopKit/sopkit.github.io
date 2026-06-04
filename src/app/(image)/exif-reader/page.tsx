import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExifReaderTool from "@/components/tools/image/ExifReaderTool";

export const metadata = {
	title: "EXIF Reader Online Free - Compress & Convert Images | SopKit",
	description: "Extract metadata and EXIF data from images including camera settings and GPS location No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/exif-reader",
	},
	openGraph: {
		title: "EXIF Reader Online Free - No Signup",
		description: "Extract metadata and EXIF data from images including camera settings and GPS location No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/exif-reader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "EXIF Reader Online Free - Fast & Secure",
		description: "Extract metadata and EXIF data from images including camera settings and GPS location No signup, no uploads, 100% private browser-based tool.",
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
		<ToolLayout tool={tool}>
			<ExifReaderTool />
		</ToolLayout>
	);
}
