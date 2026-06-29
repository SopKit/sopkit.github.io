import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import NumberGeneratorTool from "@/components/tools/generators/NumberGeneratorTool";

export const metadata = {
	title: "Number Generator Online Free - No Signup | SopKit",
	description: "Professional Number Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/number-generator/",
	},
	openGraph: {
		title: "Number Generator Online Free - No Signup",
		description: "Professional Number Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/number-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Number Generator Online Free - Fast & Secure",
		description: "Professional Number Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/number-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NumberGeneratorTool />
		</ToolLayout>
	);
}
