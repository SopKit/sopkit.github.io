import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "HTML Encoder Online Free - Developer Tools | SopKit",
	description: "Encode text into HTML entities instantly for secure web display. Our free online tool protects your markup by converting special characters into safe HTML-encoded strings. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-encoder",
	},
	openGraph: {
		title: "HTML Encoder Online Free - No Signup",
		description: "Encode text into HTML entities instantly for secure web display. Our free online tool protects your markup by converting special characters into safe HTML-encod",
		url: "https://sopkit.github.io/html-encoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HTML Encoder Online Free - Fast & Secure",
		description: "Encode text into HTML entities instantly for secure web display. Our free online tool protects your markup by converting special characters into safe HTML-encod",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-encoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-encoder" />
		</ToolLayout>
	);
}
