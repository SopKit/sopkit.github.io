import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AsciiArtGeneratorTool from "@/components/tools/generators/AsciiArtGeneratorTool";

export const metadata = {
	title: "ASCII Art Generator Online Free - No Signup | SopKit",
	description: "Convert images into text-based ASCII art online. Customize resolution and contrast for the perfect text-based representation. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ascii-art-generator",
	},
	openGraph: {
		title: "ASCII Art Generator Online Free - No Signup",
		description: "Convert images into text-based ASCII art online. Customize resolution and contrast for the perfect text-based representation. No signup, no uploads, 100% privat",
		url: "https://sopkit.github.io/ascii-art-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "ASCII Art Generator Online Free - Fast & Secure",
		description: "Convert images into text-based ASCII art online. Customize resolution and contrast for the perfect text-based representation. No signup, no uploads, 100% privat",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ascii-art-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<AsciiArtGeneratorTool />
		</ToolLayout>
	);
}
