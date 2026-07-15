import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Discount Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Discount Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "discount calculator, free online tool, no signup, discount calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/discount-calculator",
	},
	openGraph: {
		title: "Free Discount Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Discount Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/discount-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Discount Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Discount Calculator online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="discount-calculator" />
		</ToolLayout>
	);
}
