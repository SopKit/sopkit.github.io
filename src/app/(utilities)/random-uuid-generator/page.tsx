import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UuidGenerator from "@/components/tools/built-ins/UuidGeneratorTool";

export const metadata = {
	title: "Random UUID Generator Online Free - No Signup | SopKit",
	description: "Free random uuid generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/random-uuid-generator/",
	},
	openGraph: {
		title: "Random UUID Generator Online Free - No Signup",
		description: "Free random uuid generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		url: "https://sopkit.github.io/random-uuid-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Random UUID Generator Online Free - Fast & Secure",
		description: "Free random uuid generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/random-uuid-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UuidGenerator />
		</ToolLayout>
	);
}
