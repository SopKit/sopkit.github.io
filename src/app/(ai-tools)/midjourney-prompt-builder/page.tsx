import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MidjourneyPromptBuilder from "@/components/tools/ai/MidjourneyPromptBuilder";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Midjourney Prompt Builder Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Midjourney Prompt Builder online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "midjourney prompt builder, midjourney prompt generator, ai art prompt helper, free online prompt builder, SopKit, midjourney-prompt-builder, free midjourney-prompt-builder, midjourney prompt generator online, online prompt builder, free art helper, midjourney prompt parameters, imagine prompt creator",
	alternates: {
		canonical: "https://sopkit.github.io/midjourney-prompt-builder",
	},
	openGraph: {
		title: "Free Midjourney Prompt Builder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Midjourney Prompt Builder online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/midjourney-prompt-builder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Midjourney Prompt Builder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Midjourney Prompt Builder online. Fast, secure browser-based utility with no registration. Free & secure.",
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
