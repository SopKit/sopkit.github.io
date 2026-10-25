import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FinanceCalculators from "@/components/tools/impl/FinanceCalculators";


export const metadata = {
	title: "Free SIP Calculator India — No Signup | SopKit",
	description: "Calculate SIP returns in India: enter your monthly investment, expected annual return and years to see invested amount, estimated gains and maturity value.",
	keywords: "sip calculator, sip calculator india, mutual fund sip returns calculator, monthly investment calculator, sip maturity value, SopKit",
	alternates: {
		canonical: `${SITE_URL}/sip-calculator`,
	},
	openGraph: {
		title: "Free SIP Calculator India — No Signup | SopKit",
		description: "Calculate SIP returns in India: enter your monthly investment, expected annual return and years to see invested amount, estimated gains and maturity value.",
		url: `${SITE_URL}/sip-calculator`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SIP Calculator India — No Signup | SopKit",
		description: "Calculate SIP returns in India: enter your monthly investment, expected annual return and years to see invested amount, estimated gains and maturity value.",
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
