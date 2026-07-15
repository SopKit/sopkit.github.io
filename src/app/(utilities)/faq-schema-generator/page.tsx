import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaqSchemaGenerator from "@/components/tools/built-ins/FaqSchemaGenerator";

export const metadata = {
	title: "Free FAQ Schema Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free FAQ Schema Generator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "faq schema generator, free online tool, no signup, faq schema generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/faq-schema-generator",
	},
	openGraph: {
		title: "Free FAQ Schema Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free FAQ Schema Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/faq-schema-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free FAQ Schema Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free FAQ Schema Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/faq-schema-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaqSchemaGenerator />
		</ToolLayout>
	);
}
