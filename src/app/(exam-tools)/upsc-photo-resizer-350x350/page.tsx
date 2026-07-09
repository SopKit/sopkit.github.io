import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";


export const metadata = {
	title: "UPSC Photo Resizer 350x350 Online Free | SopKit",
	description: "Resize UPSC photo to 350x350 pixels and compress it for IAS, IFS, and other UPSC application forms. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/upsc-photo-resizer-350x350/",
	},
	openGraph: {
		title: "UPSC Photo Resizer 350x350 Online Free - No Signup | SopKit",
		description: "Resize UPSC photo to 350x350 pixels and compress it for IAS, IFS, and other UPSC application forms. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/upsc-photo-resizer-350x350/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "UPSC Photo Resizer 350x350 Online Free - Fast & Secure",
		description: "Resize UPSC photo to 350x350 pixels and compress it for IAS, IFS, and other UPSC application forms. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/upsc-photo-resizer-350x350");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExamPhotoResizer examName="UPSC" presetWidth={350} presetHeight={350} />
		</ToolLayout>
	);
}
