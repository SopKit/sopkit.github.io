import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "JavaScript Minifier Online Free - Developer Tools | SopKit",
	description: "Compress and minify your JavaScript files to reduce payload size and speed up your website. Our free online tool removes unnecessary code while preserving functionality. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/javascript-minifier",
	},
	openGraph: {
		title: "JavaScript Minifier Online Free - No Signup",
		description: "Compress and minify your JavaScript files to reduce payload size and speed up your website. Our free online tool removes unnecessary code while preserving funct",
		url: "https://sopkit.github.io/javascript-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JavaScript Minifier Online Free - Fast & Secure",
		description: "Compress and minify your JavaScript files to reduce payload size and speed up your website. Our free online tool removes unnecessary code while preserving funct",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/javascript-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInMarkup toolId="javascript-minifier" />
		</ToolLayout>
	);
}
