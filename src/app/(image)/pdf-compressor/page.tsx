import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Compressor Online - Reduce PDF File Size | SopKit",
	description: "Compress and reduce the file size of your PDF documents instantly without losing visual quality. Safe, browser-based local compression with no server uploads.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-compressor/",
	},
	openGraph: {
		title: "Free PDF Compressor Online - Reduce PDF File Size | SopKit",
		description: "Compress and reduce the file size of your PDF documents instantly without losing visual quality. Safe, browser-based local compression with no server uploads.",
		url: "https://sopkit.github.io/pdf-compressor/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Compressor Online - Reduce PDF File Size | SopKit",
		description: "Compress and reduce the file size of your PDF documents instantly without losing visual quality. Safe, browser-based local compression with no server uploads.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-compressor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
