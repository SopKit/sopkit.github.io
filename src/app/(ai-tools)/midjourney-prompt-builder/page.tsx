import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MidjourneyPromptBuilder from "@/components/tools/ai/MidjourneyPromptBuilder";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Midjourney Prompt Builder Online - No Signup | SopKit",
	description: "Create highly optimized, rich Midjourney prompt command strings instantly. Choose from various art mediums, lighting parameters, and aspect ratios. No signup required.",
	keywords: "midjourney prompt builder, midjourney prompt generator, ai art prompt helper, free online prompt builder, SopKit, midjourney-prompt-builder, free midjourney-prompt-builder, midjourney prompt generator online, online prompt builder, free art helper, midjourney prompt parameters, imagine prompt creator",
	alternates: {
		canonical: "https://sopkit.github.io/midjourney-prompt-builder/",
	},
	openGraph: {
		title: "Free Midjourney Prompt Builder Online - No Signup | SopKit",
		description: "Create highly optimized, rich Midjourney prompt command strings instantly. Choose from various art mediums, lighting parameters, and aspect ratios. No signup required.",
		url: "https://sopkit.github.io/midjourney-prompt-builder/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Midjourney Prompt Builder Online - Fast & Secure",
		description: "Create highly optimized, rich Midjourney prompt command strings instantly. Choose from various art mediums, lighting parameters, and aspect ratios. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/midjourney-prompt-builder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MidjourneyPromptBuilder />
		</ToolLayout>
	);
}
