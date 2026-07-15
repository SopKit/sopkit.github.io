import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DomainToIPTool from "@/components/tools/built-ins/DomainToIPTool";

export const metadata = {
	title: "Free Domain to IP Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Domain to IP Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "domain to ip converter, free online tool, no signup, domain to ip converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/domain-to-ip-converter",
	},
	openGraph: {
		title: "Free Domain to IP Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Domain to IP Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/domain-to-ip-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Domain to IP Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Domain to IP Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-to-ip-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DomainToIPTool />
		</ToolLayout>
	);
}
