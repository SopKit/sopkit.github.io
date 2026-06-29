import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CreditCardValidatorTool from "@/components/tools/security/CreditCardValidatorTool";

export const metadata = {
	title: "Credit Card Validator Online Free - No Signup | SopKit",
	description: "Check if a credit card number is valid using the Luhn algorithm instantly. Our free online tool helps you verify card formats and identify card types for testing purposes. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/credit-card-validator/",
	},
	openGraph: {
		title: "Credit Card Validator Online Free - No Signup",
		description: "Check if a credit card number is valid using the Luhn algorithm instantly. Our free online tool helps you verify card formats and identify card types for testin",
		url: "https://sopkit.github.io/credit-card-validator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Credit Card Validator Online Free - Fast & Secure",
		description: "Check if a credit card number is valid using the Luhn algorithm instantly. Our free online tool helps you verify card formats and identify card types for testin",
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
