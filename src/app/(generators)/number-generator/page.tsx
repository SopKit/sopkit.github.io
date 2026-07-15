import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import NumberGeneratorTool from "@/components/tools/generators/NumberGeneratorTool";

export const metadata = {
	title: "Free Number Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Number Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "number generator, free online tool, no signup, number generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/number-generator",
	},
	openGraph: {
		title: "Free Number Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Number Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/number-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Number Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Number Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
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
