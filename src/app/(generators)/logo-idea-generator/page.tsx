import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Logo Idea Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Logo Idea Generator online. Generate high-quality outputs instantly with no registration required. No registration needed.",
	keywords: "logo idea generator, logo-idea-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/logo-idea-generator",
	},
	openGraph: {
		title: "Free Logo Idea Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Logo Idea Generator online. Generate high-quality outputs instantly with no registration required. No registration needed.",
		url: "https://sopkit.github.io/logo-idea-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Logo Idea Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Logo Idea Generator online. Generate high-quality outputs instantly with no registration required. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/logo-idea-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: tool.name,
						description: tool.description,
						url: "https://sopkit.github.io/logo-idea-generator/",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD"
						}
					})
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
