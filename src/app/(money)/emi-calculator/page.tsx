import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";


export const metadata = {
	title: "EMI Calculator for Loans Online Free | SopKit",
	description: "Calculate monthly EMI, total interest, and repayment amount for home loans, car loans, and personal loans. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/emi-calculator",
	},
	openGraph: {
		title: "EMI Calculator for Loans Online Free - No Signup | SopKit",
		description: "Calculate monthly EMI, total interest, and repayment amount for home loans, car loans, and personal loans. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/emi-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "EMI Calculator for Loans Online Free - Fast & Secure",
		description: "Calculate monthly EMI, total interest, and repayment amount for home loans, car loans, and personal loans. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/emi-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BuiltInCalculators kind="loan-calculator" />
		</ToolLayout>
	);
}
