import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Reactive Energy Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Reactive Energy Converter online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "reactive energy converter, free online tool, no signup, reactive energy converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/reactive-energy-converter",
	},
	openGraph: {
		title: "Free Reactive Energy Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Reactive Energy Converter online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/reactive-energy-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Reactive Energy Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Reactive Energy Converter online. Fast, secure browser-based utility with no registration. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/reactive-energy-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="energy" />
		</ToolLayout>
	);
}
