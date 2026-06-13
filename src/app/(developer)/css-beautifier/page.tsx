import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "CSS Beautifier Online Free - Developer Tools | SopKit",
	description: "Format and prettify your CSS code instantly with our free online CSS Beautifier. Improve code readability, fix indentation, and organize your stylesheets for better maintenance. Fast and secure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/css-beautifier",
	},
	openGraph: {
		title: "CSS Beautifier Online Free - No Signup",
		description: "Format and prettify your CSS code instantly with our free online CSS Beautifier. Improve code readability, fix indentation, and organize your stylesheets for be",
		url: "https://sopkit.github.io/css-beautifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CSS Beautifier Online Free - Fast & Secure",
		description: "Format and prettify your CSS code instantly with our free online CSS Beautifier. Improve code readability, fix indentation, and organize your stylesheets for be",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/css-beautifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="css-beautifier" />
		</ToolLayout>
	);
}
