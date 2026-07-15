import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlCodecTool from "@/components/tools/built-ins/UrlCodecTool";

export const metadata = {
	title: "Free URL Decode Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free URL Decode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "url decode, free online tool, no signup, url decode online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-decode",
	},
	openGraph: {
		title: "Free URL Decode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Decode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/url-decode",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Decode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Decode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-decode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlCodecTool mode="decode" />
		</ToolLayout>
	);
}
