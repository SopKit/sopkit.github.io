import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Pace Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Pace Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "pace converter, free online tool, no signup, pace converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pace-converter",
	},
	openGraph: {
		title: "Free Pace Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Pace Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/pace-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Pace Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Pace Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pace-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="pace" />
		</ToolLayout>
	);
}
