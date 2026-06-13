import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Currency Converter Online Free - No Signup | SopKit",
	description: "Convert currencies with real-time exchange rates instantly. Our free online tool supports all major global currencies for travel, business, and financial planning. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/currency-converter",
	},
	openGraph: {
		title: "Currency Converter Online Free - No Signup",
		description: "Convert currencies with real-time exchange rates instantly. Our free online tool supports all major global currencies for travel, business, and financial planni",
		url: "https://sopkit.github.io/currency-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Currency Converter Online Free - Fast & Secure",
		description: "Convert currencies with real-time exchange rates instantly. Our free online tool supports all major global currencies for travel, business, and financial planni",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/currency-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="currency-converter" />
		</ToolLayout>
	);
}
