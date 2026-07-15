import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LegalTemplateGenerator from "@/components/tools/built-ins/LegalTemplateGenerator";

export const metadata = {
	title: "Free Privacy Policy Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Privacy Policy Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "privacy policy generator, free online tool, no signup, privacy policy generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/privacy-policy-generator",
	},
	openGraph: {
		title: "Free Privacy Policy Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Privacy Policy Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/privacy-policy-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Privacy Policy Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Privacy Policy Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/privacy-policy-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LegalTemplateGenerator />
		</ToolLayout>
	);
}
