import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Energy Converter - Convert Joules, Calories, kWh & BTU | SopKit",
	description: "Convert energy units instantly — joules, calories, kilowatt-hours, BTU, electronvolts and more. Free, accurate energy converter that runs entirely in your browser. No signup, 100% private.",
	keywords: "energy converter, joules to calories, kwh to joules, btu converter, convert energy units, free energy calculator",
	alternates: {
		canonical: "https://sopkit.github.io/energy-converter/",
	},
	openGraph: {
		title: "Energy Converter - Joules, Calories, kWh & BTU",
		description: "Convert energy units instantly — joules, calories, kilowatt-hours, BTU and more. Free, accurate, and private. Runs entirely in your browser, no signup.",
		url: "https://sopkit.github.io/energy-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Energy Converter - Joules, Calories, kWh & BTU",
		description: "Convert energy units instantly — joules, calories, kilowatt-hours, BTU and more. Free, accurate, and private. Runs entirely in your browser, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/energy-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="energy" />
		</ToolLayout>
	);
}
