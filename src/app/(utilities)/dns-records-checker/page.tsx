import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DnsLookupTool from "@/components/tools/built-ins/DnsLookupTool";

export const metadata = {
	title: "Free DNS Records Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free DNS Records Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "dns records checker, free online tool, no signup, dns records checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/dns-records-checker",
	},
	openGraph: {
		title: "Free DNS Records Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free DNS Records Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/dns-records-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free DNS Records Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free DNS Records Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/dns-records-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DnsLookupTool />
		</ToolLayout>
	);
}
