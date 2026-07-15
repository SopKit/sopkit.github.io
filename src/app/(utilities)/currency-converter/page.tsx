import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Currency Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Currency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "currency converter, free online tool, no signup, currency converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/currency-converter",
	},
	openGraph: {
		title: "Free Currency Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Currency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/currency-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Currency Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Currency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
