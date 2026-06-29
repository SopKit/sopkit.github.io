import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "JavaScript Beautifier Online Free - Developer Tools | SopKit",
	description: "Format and prettify your JavaScript code instantly. Our free online JS Beautifier improves code readability, fixes indentation, and helps you understand complex scripts easily. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-beautifier/",
	},
	openGraph: {
		title: "JavaScript Beautifier Online Free - No Signup",
		description: "Format and prettify your JavaScript code instantly. Our free online JS Beautifier improves code readability, fixes indentation, and helps you understand complex",
		url: "https://sopkit.github.io/javascript-beautifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JavaScript Beautifier Online Free - Fast & Secure",
		description: "Format and prettify your JavaScript code instantly. Our free online JS Beautifier improves code readability, fixes indentation, and helps you understand complex",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-beautifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-beautifier" />
		</ToolLayout>
	);
}
