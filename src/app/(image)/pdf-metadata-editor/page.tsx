import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Metadata Editor Online - Edit PDF Tags | SopKit",
	description: "Edit PDF document tags and property values including Title, Author, Subject, Creator, and Keywords. Secure client-side processing, no files uploaded.",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-metadata-editor/",
	},
	openGraph: {
		title: "Free PDF Metadata Editor Online - Edit PDF Tags | SopKit",
		description: "Edit PDF document tags and property values including Title, Author, Subject, Creator, and Keywords. Secure client-side processing, no files uploaded.",
		url: "https://sopkit.github.io/pdf-metadata-editor/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Metadata Editor Online - Edit PDF Tags | SopKit",
		description: "Edit PDF document tags and property values including Title, Author, Subject, Creator, and Keywords. Secure client-side processing, no files uploaded.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-metadata-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
