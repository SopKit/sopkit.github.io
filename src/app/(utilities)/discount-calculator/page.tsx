import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Discount Calculator Online Free - No Signup | SopKit",
	description: "Calculate the final price after discounts and taxes instantly. Our free online tool helps you find the best deals and savings while shopping. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/discount-calculator",
	},
	openGraph: {
		title: "Discount Calculator Online Free - No Signup",
		description: "Calculate the final price after discounts and taxes instantly. Our free online tool helps you find the best deals and savings while shopping. No signup, no uplo",
		url: "https://sopkit.github.io/discount-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Discount Calculator Online Free - Fast & Secure",
		description: "Calculate the final price after discounts and taxes instantly. Our free online tool helps you find the best deals and savings while shopping. No signup, no uplo",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/discount-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BuiltInCalculators kind="discount-calculator" />
		</ToolLayout>
	);
}
