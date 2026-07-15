import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Each Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Each Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "each converter, free online tool, no signup, each converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/each-converter",
	},
	openGraph: {
		title: "Free Each Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Each Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/each-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Each Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Each Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/each-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="typography" />
		</ToolLayout>
	);
}
