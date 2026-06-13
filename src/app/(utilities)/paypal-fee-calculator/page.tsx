import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Paypal Fee Calculator Online Free - No Signup | SopKit",
	description: "Free paypal fee calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/paypal-fee-calculator",
	},
	openGraph: {
		title: "Paypal Fee Calculator Online Free - No Signup",
		description: "Free paypal fee calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		url: "https://sopkit.github.io/paypal-fee-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Paypal Fee Calculator Online Free - Fast & Secure",
		description: "Free paypal fee calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
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
