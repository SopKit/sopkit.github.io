import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
	title: "AI Writing Tools - Free Text & Content Generators | SopKit",
	description: "Free AI writing tools. Generate social media bios, custom poems, excuses, resignation letters, and marketing slogans instantly in your browser.",
	alternates: { canonical: "https://sopkit.github.io/ai-writing-tools/" },
};

export default function AiWritingToolsHub() {
	return (
		<HubPage
			title="AI Writing Tools"
			description="Draft copy, format paragraphs, generate slogans, and write custom emails with our free online AI writing and text tools."
			route="/ai-writing-tools"
		tools={getAllTools().filter(t => ["review-reply-generator","product-description-generator","instagram-caption-generator","seo-title-meta-description-generator","meta-tag-generator","open-graph-generator","twitter-card-generator","description-generator"].includes(t.id))}			guideTitle="Optimizing Your AI Writing"
			guidePoints={[
				"Use detailed prompts to get precise tone, style, and context matching for your letters and bios.",
				"Check and refine all generated resignation letters and leave letters before sending them to your team.",
				"Use slogan and name generators as brainstorming inputs rather than immediate brand definitions.",
			]}
			faqs={[
				{ question: "Is registration required to write text?", answer: "No, you can generate letters, bios, and copy instantly without signing up." },
				{ question: "Can I use generated copy commercially?", answer: "Yes, all output copy can be used for personal and business copy requirements for free." },
				{ question: "Do you store the generated texts?", answer: "No, everything runs locally in your browser window and is cleared once you close the tab." },
			]}
		/>
	);
}
