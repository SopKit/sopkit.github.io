import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlParserTool from "@/components/tools/built-ins/UrlParserTool";

export const metadata = {
	title: "Free URL Parser Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free URL Parser online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "url parser, free online tool, no signup, url parser online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-parser",
	},
	openGraph: {
		title: "Free URL Parser Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Parser online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/url-parser",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Parser Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Parser online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-parser");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlParserTool />
		</ToolLayout>
	);
}
