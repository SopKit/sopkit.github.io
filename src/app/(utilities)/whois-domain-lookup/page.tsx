import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Whois Domain Lookup Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Whois Domain Lookup online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "whois domain lookup, free online tool, no signup, whois domain lookup online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/whois-domain-lookup",
	},
	openGraph: {
		title: "Free Whois Domain Lookup Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Whois Domain Lookup online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/whois-domain-lookup",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Whois Domain Lookup Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Whois Domain Lookup online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
