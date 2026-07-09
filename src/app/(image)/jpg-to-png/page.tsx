import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "JPG to PNG Converter Online Free | SopKit",
	description: "Convert JPG photos to PNG format to support transparency and lossless compression. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jpg-to-png/",
	},
	openGraph: {
		title: "JPG to PNG Converter Online Free - No Signup | SopKit",
		description: "Convert JPG photos to PNG format to support transparency and lossless compression. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/jpg-to-png/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JPG to PNG Converter Online Free - Fast & Secure",
		description: "Convert JPG photos to PNG format to support transparency and lossless compression. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/jpg-to-png");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
