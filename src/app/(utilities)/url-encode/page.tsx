import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UrlCodecTool from "@/components/tools/built-ins/UrlCodecTool";

export const metadata = {
	title: "Free URL Encode Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free URL Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "url encode, free online tool, no signup, url encode online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/url-encode",
	},
	openGraph: {
		title: "Free URL Encode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/url-encode",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Encode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free URL Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/url-encode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UrlCodecTool mode="encode" />
		</ToolLayout>
	);
}
