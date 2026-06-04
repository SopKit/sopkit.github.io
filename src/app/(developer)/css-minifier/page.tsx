import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInMarkup from "@/components/tools/built-ins/BuiltInMarkup";

export const metadata = {
	title: "CSS Minifier Online Free - Developer Tools | SopKit",
	description: "Compress and minify your CSS files to reduce page load times and improve website performance. Our free online tool removes unnecessary whitespace and comments instantly. Privacy-focused. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/css-minifier",
	},
	openGraph: {
		title: "CSS Minifier Online Free - No Signup",
		description: "Compress and minify your CSS files to reduce page load times and improve website performance. Our free online tool removes unnecessary whitespace and comments i",
		url: "https://sopkit.github.io/css-minifier",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CSS Minifier Online Free - Fast & Secure",
		description: "Compress and minify your CSS files to reduce page load times and improve website performance. Our free online tool removes unnecessary whitespace and comments i",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/css-minifier");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BuiltInMarkup toolId="css-minifier" />
		</ToolLayout>
	);
}
