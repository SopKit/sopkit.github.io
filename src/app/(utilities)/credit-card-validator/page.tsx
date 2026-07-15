import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CreditCardValidatorTool from "@/components/tools/security/CreditCardValidatorTool";

export const metadata = {
	title: "Free Credit Card Validator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Credit Card Validator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "credit card validator, free online tool, no signup, credit card validator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/credit-card-validator",
	},
	openGraph: {
		title: "Free Credit Card Validator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Credit Card Validator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/credit-card-validator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Credit Card Validator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Credit Card Validator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/credit-card-validator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CreditCardValidatorTool />
		</ToolLayout>
	);
}
