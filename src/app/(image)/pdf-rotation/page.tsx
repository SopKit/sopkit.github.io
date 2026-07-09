import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Rotation Tool Online - Rotate PDF Pages | SopKit",
	description: "Rotate individual pages or all pages of a PDF document to landscape or portrait orientation instantly. Safe, free, browser-based PDF utility.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-rotation/",
	},
	openGraph: {
		title: "Free PDF Rotation Tool Online - Rotate PDF Pages | SopKit",
		description: "Rotate individual pages or all pages of a PDF document to landscape or portrait orientation instantly. Safe, free, browser-based PDF utility.",
		url: "https://sopkit.github.io/pdf-rotation/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Rotation Tool Online - Rotate PDF Pages | SopKit",
		description: "Rotate individual pages or all pages of a PDF document to landscape or portrait orientation instantly. Safe, free, browser-based PDF utility.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-rotation");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
