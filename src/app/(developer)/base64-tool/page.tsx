import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";

export const metadata = {
	title: "Free Base64 Tool Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Base64 Tool online. Secure, local developer utility with no registration. No signup required.",
	keywords: "base64 tool, free online tool, no signup, base64 tool online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/base64-tool",
	},
	openGraph: {
		title: "Free Base64 Tool Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Base64 Tool online. Secure, local developer utility with no registration. No signup required.",
		url: "https://sopkit.github.io/base64-tool",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Base64 Tool Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Base64 Tool online. Secure, local developer utility with no registration. No signup required.",
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
