import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";

export const metadata = {
	title: "Free PAN Card Photo Resizer Online - No Signup | SopKit",
	description: "Resize and compress files with our free PAN Card Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
	keywords: "pan-card-photo-resizer, PAN Card Photo Resizer, pan photo resizer, nsdl photo resizer, uti photo resizer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pan-card-photo-resizer/",
	},
	openGraph: {
		title: "Free PAN Card Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free PAN Card Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
		url: "https://sopkit.github.io/pan-card-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PAN Card Photo Resizer Online - No Signup | SopKit",
		description: "Resize and compress files with our free PAN Card Photo Resizer online. Safe and private browser utility for government exam portal applications. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pan-card-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
