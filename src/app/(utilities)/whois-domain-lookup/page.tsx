import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Whois Domain Lookup Online Free - No Signup | SopKit",
	description: "Free whois domain lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/whois-domain-lookup",
	},
	openGraph: {
		title: "Whois Domain Lookup Online Free - No Signup",
		description: "Free whois domain lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based to",
		url: "https://sopkit.github.io/whois-domain-lookup",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Whois Domain Lookup Online Free - Fast & Secure",
		description: "Free whois domain lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based to",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/whois-domain-lookup");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="whois-domain-lookup" />
		</ToolLayout>
	);
}
