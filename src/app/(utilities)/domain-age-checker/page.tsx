import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Domain Age Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Domain Age Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "domain age checker, free online tool, no signup, domain age checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/domain-age-checker",
	},
	openGraph: {
		title: "Free Domain Age Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Domain Age Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/domain-age-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Domain Age Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Domain Age Checker online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-age-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="domain-age-checker" />
		</ToolLayout>
	);
}
