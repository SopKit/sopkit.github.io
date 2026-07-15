import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UTMBuilderTool from "@/components/tools/utilities/UTMBuilderTool";

export const metadata = {
	title: "Free UTM Builder Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free UTM Builder online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "utm builder, free online tool, no signup, utm builder online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/utm-builder",
	},
	openGraph: {
		title: "Free UTM Builder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free UTM Builder online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/utm-builder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free UTM Builder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free UTM Builder online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/utm-builder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UTMBuilderTool />
		</ToolLayout>
	);
}
