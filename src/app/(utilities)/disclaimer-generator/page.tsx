import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LegalTemplateGenerator from "@/components/tools/built-ins/LegalTemplateGenerator";

export const metadata = {
	title: "Free Disclaimer Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Disclaimer Generator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "disclaimer generator, free online tool, no signup, disclaimer generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/disclaimer-generator",
	},
	openGraph: {
		title: "Free Disclaimer Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Disclaimer Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/disclaimer-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Disclaimer Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Disclaimer Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/disclaimer-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LegalTemplateGenerator />
		</ToolLayout>
	);
}
