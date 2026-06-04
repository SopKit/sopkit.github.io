import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";

export const metadata = {
	title: "Base64 Decode Online Free - No Signup | SopKit",
	description: "Decode Base64 strings back to their original plain text instantly. Our privacy-first tool processes everything in your browser, ensuring your data never leaves your device. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/base64-decode",
	},
	openGraph: {
		title: "Base64 Decode Online Free - No Signup",
		description: "Decode Base64 strings back to their original plain text instantly. Our privacy-first tool processes everything in your browser, ensuring your data never leaves ",
		url: "https://sopkit.github.io/base64-decode",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Base64 Decode Online Free - Fast & Secure",
		description: "Decode Base64 strings back to their original plain text instantly. Our privacy-first tool processes everything in your browser, ensuring your data never leaves ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-decode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
