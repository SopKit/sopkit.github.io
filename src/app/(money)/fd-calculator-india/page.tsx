import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "FD Calculator India Online Free | SopKit",
	description: "Calculate fixed deposit maturity amount and interest with quarterly compounding for Indian banks. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/fd-calculator-india/",
	},
	openGraph: {
		title: "FD Calculator India Online Free - No Signup | SopKit",
		description: "Calculate fixed deposit maturity amount and interest with quarterly compounding for Indian banks. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/fd-calculator-india/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FD Calculator India Online Free - Fast & Secure",
		description: "Calculate fixed deposit maturity amount and interest with quarterly compounding for Indian banks. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/fd-calculator-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="fd" />
		</ToolLayout>
	);
}
