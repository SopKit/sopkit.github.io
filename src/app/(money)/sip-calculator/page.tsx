import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "SIP Calculator India Online Free | SopKit",
	description: "Calculate estimated SIP returns and wealth growth for mutual fund investments online for free. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/sip-calculator/",
	},
	openGraph: {
		title: "SIP Calculator India Online Free - No Signup | SopKit",
		description: "Calculate estimated SIP returns and wealth growth for mutual fund investments online for free. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/sip-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SIP Calculator India Online Free - Fast & Secure",
		description: "Calculate estimated SIP returns and wealth growth for mutual fund investments online for free. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/sip-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FinanceCalculators defaultTab="sip" />
		</ToolLayout>
	);
}
