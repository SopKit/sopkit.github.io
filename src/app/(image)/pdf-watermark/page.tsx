import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Add Watermark to PDF Online Free - Protect PDF Files | SopKit",
	description: "Add text or image watermark logos to all pages of your PDF document securely in your browser. Customize rotation, transparency, and positioning instantly.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-watermark/",
	},
	openGraph: {
		title: "Add Watermark to PDF Online Free - Protect PDF Files | SopKit",
		description: "Add text or image watermark logos to all pages of your PDF document securely in your browser. Customize rotation, transparency, and positioning instantly.",
		url: "https://sopkit.github.io/pdf-watermark/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Add Watermark to PDF Online Free - Protect PDF Files | SopKit",
		description: "Add text or image watermark logos to all pages of your PDF document securely in your browser. Customize rotation, transparency, and positioning instantly.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-watermark");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
