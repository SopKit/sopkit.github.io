import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import Base64Tool from "@/components/tools/developer/Base64Tool";

export const metadata = {
	title: "Free Base64 Encode Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Base64 Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "base64 encode, free online tool, no signup, base64 encode online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/base64-encode",
	},
	openGraph: {
		title: "Free Base64 Encode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Base64 Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/base64-encode",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Base64 Encode Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Base64 Encode online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<Base64Tool />
		</ToolLayout>
	);
}
