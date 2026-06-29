import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";

export const metadata = {
	title: "Base64 Tool Online Free - Developer Tools | SopKit",
	description: "Encode and decode Base64 strings instantly with our free online tool. Perfect for web development, data transmission, and working with binary data in text format. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/base64-tool/",
	},
	openGraph: {
		title: "Base64 Tool Online Free - No Signup",
		description: "Encode and decode Base64 strings instantly with our free online tool. Perfect for web development, data transmission, and working with binary data in text forma",
		url: "https://sopkit.github.io/base64-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Base64 Tool Online Free - Fast & Secure",
		description: "Encode and decode Base64 strings instantly with our free online tool. Perfect for web development, data transmission, and working with binary data in text forma",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
