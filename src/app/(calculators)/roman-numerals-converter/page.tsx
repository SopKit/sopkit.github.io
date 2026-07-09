import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Roman Numerals Converter Online Free | SopKit",
	description: "Convert numbers to Roman numerals and vice versa instantly. Supports large numbers and historical formats. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/roman-numerals-converter/",
	},
	openGraph: {
		title: "Roman Numerals Converter Online Free - No Signup | SopKit",
		description: "Convert numbers to Roman numerals and vice versa instantly. Supports large numbers and historical formats. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/roman-numerals-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Roman Numerals Converter Online Free - Fast & Secure",
		description: "Convert numbers to Roman numerals and vice versa instantly. Supports large numbers and historical formats. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/roman-numerals-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
