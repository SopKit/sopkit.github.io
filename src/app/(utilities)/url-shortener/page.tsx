import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import URLShortenerTool from "@/components/tools/utilities/URLShortenerTool";

export const metadata = {
	title: "Free URL Shortener Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free URL Shortener online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "url shortener, free online tool, no signup, url shortener online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-shortener",
	},
	openGraph: {
		title: "Free URL Shortener Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Shortener online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/url-shortener",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Shortener Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Shortener online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-shortener");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<URLShortenerTool />
		</ToolLayout>
	);
}
