import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AiPersonaPromptGenerator from "@/components/tools/ai/AiPersonaPromptGenerator";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free AI Persona & System Prompt Generator - No Signup | SopKit",
	description: "Generate highly optimized system prompts and expert persona roles for ChatGPT, Claude, and Gemini instantly. Customize tone, rules, and constraints for better AI answers.",
	keywords: "ai persona generator, system prompt generator, chatgpt persona creator, claude system prompt builder, free online prompt helper, SopKit, ai-persona-prompt-generator, free ai-persona-prompt-generator, system prompt generator online, online prompt builder, free persona helper, ai system instructions creator",
	alternates: {
		canonical: "https://sopkit.github.io/ai-persona-prompt-generator/",
	},
	openGraph: {
		title: "Free AI Persona & System Prompt Generator - No Signup | SopKit",
		description: "Generate highly optimized system prompts and expert persona roles for ChatGPT, Claude, and Gemini instantly. Customize tone, rules, and constraints for better AI answers.",
		url: "https://sopkit.github.io/ai-persona-prompt-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free AI Persona & System Prompt Generator - Fast & Secure",
		description: "Generate highly optimized system prompts and expert persona roles for ChatGPT, Claude, and Gemini instantly. Customize tone, rules, and constraints for better AI answers.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-persona-prompt-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AiPersonaPromptGenerator />
		</ToolLayout>
	);
}
