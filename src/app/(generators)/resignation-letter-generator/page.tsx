import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResignationLetterGenerator from "@/components/tools/generators/ResignationLetterGenerator";

export const metadata = {
	title: "Free Resignation Letter Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Resignation Letter Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
	keywords: "resignation-letter-generator, Resignation Letter Generator",
	alternates: {
		canonical: "https://sopkit.github.io/resignation-letter-generator",
	},
	openGraph: {
		title: "Free Resignation Letter Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Resignation Letter Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
		url: "https://sopkit.github.io/resignation-letter-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Resignation Letter Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Resignation Letter Generator online. Generate high-quality outputs instantly with no registration required. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/resignation-letter-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResignationLetterGenerator />
		</ToolLayout>
	);
}
