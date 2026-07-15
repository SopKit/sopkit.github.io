import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CreditCardGeneratorTool from "@/components/tools/security/CreditCardGeneratorTool";

export const metadata = {
	title: "Free Credit Card Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Credit Card Generator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "credit card generator, free online tool, no signup, credit card generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/credit-card-generator",
	},
	openGraph: {
		title: "Free Credit Card Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Credit Card Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/credit-card-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Credit Card Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Credit Card Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/credit-card-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CreditCardGeneratorTool />
		</ToolLayout>
	);
}
