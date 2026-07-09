import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "HTML Beautifier Online Free - Developer Tools | SopKit",
	description: "Format and prettify your HTML code instantly. Our free online HTML Beautifier fixes indentation, improves readability, and cleans up messy markup for better web development. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-beautifier/",
	},
	openGraph: {
		title: "HTML Beautifier Online Free - No Signup",
		description: "Format and prettify your HTML code instantly. Our free online HTML Beautifier fixes indentation, improves readability, and cleans up messy markup for better web",
		url: "https://sopkit.github.io/html-beautifier/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HTML Beautifier Online Free - Fast & Secure",
		description: "Format and prettify your HTML code instantly. Our free online HTML Beautifier fixes indentation, improves readability, and cleans up messy markup for better web",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/html-beautifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="html-beautifier" />
		</ToolLayout>
	);
}
