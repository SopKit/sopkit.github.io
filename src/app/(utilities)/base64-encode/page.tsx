import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";

export const metadata = {
	title: "Base64 Encode Online Free - No Signup | SopKit",
	description: "Encode plain text into Base64 format instantly. Our free online tool is perfect for developers, data transmission, and secure character representation in web URLs. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/base64-encode",
	},
	openGraph: {
		title: "Base64 Encode Online Free - No Signup",
		description: "Encode plain text into Base64 format instantly. Our free online tool is perfect for developers, data transmission, and secure character representation in web UR",
		url: "https://sopkit.github.io/base64-encode",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Base64 Encode Online Free - Fast & Secure",
		description: "Encode plain text into Base64 format instantly. Our free online tool is perfect for developers, data transmission, and secure character representation in web UR",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/base64-encode");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
