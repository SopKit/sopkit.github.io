import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";


export const metadata = {
	title: "Free UPSC Photo Resizer 350x350 Online - No Signup | SopKit",
	description: "Resize and compress files with our free UPSC Photo Resizer 350x350 online. Safe and private browser utility for government exam portal applications. 100% free.",
	keywords: "upsc photo resizer 350x350, free online tool, no signup, upsc photo resizer 350x350 online, exam-tools, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/upsc-photo-resizer-350x350",
	},
	openGraph: {
		title: "Free UPSC Photo Resizer 350x350 Online - No Signup | SopKit",
		description: "Resize and compress files with our free UPSC Photo Resizer 350x350 online. Safe and private browser utility for government exam portal applications. 100% free.",
		url: "https://sopkit.github.io/upsc-photo-resizer-350x350",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free UPSC Photo Resizer 350x350 Online - No Signup | SopKit",
		description: "Resize and compress files with our free UPSC Photo Resizer 350x350 online. Safe and private browser utility for government exam portal applications. 100% free.",
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
