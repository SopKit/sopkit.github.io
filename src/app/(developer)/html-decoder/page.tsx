import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "HTML Decoder Online Free - Developer Tools | SopKit",
	description: "Decode HTML entities back to their original characters instantly. Our free online tool converts &amp; and similar entities into readable text for easy debugging and content cleaning. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-decoder/",
	},
	openGraph: {
		title: "HTML Decoder Online Free - No Signup",
		description: "Decode HTML entities back to their original characters instantly. Our free online tool converts &amp; and similar entities into readable text for easy debugging",
		url: "https://sopkit.github.io/html-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HTML Decoder Online Free - Fast & Secure",
		description: "Decode HTML entities back to their original characters instantly. Our free online tool converts &amp; and similar entities into readable text for easy debugging",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-decoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-decoder" />
		</ToolLayout>
	);
}
