import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Paypal Fee Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Paypal Fee Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "paypal fee calculator, free online tool, no signup, paypal fee calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/paypal-fee-calculator",
	},
	openGraph: {
		title: "Free Paypal Fee Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Paypal Fee Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/paypal-fee-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Paypal Fee Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Paypal Fee Calculator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/paypal-fee-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="paypal-fee-calculator" />
		</ToolLayout>
	);
}
