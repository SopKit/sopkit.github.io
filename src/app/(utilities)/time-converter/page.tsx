import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Time Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Time Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "time converter, free online tool, no signup, time converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/time-converter",
	},
	openGraph: {
		title: "Free Time Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Time Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/time-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Time Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Time Converter online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/time-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="time" />
		</ToolLayout>
	);
}
