import type { Metadata } from "next";
import SeoHubPage from "@/components/seo/SeoHubPage";

export const metadata: Metadata = {
	title: "Social Media Tools - Instagram Bio, Caption & Hashtag Generators | SopKit",
	description: "Free online social media tools for content creators. Generate aesthetic Instagram bios, creative captions, hashtags, and text styles to grow your accounts.",
	alternates: { canonical: "https://sopkit.github.io/social-media-tools/" },
};

export default function SocialMediaToolsHub() {
	return (
		<SeoHubPage
			title="Social Media Tools"
			description="Boost your social media presence with free generators for bios, captions, hashtags, and text styles. Perfect for creators, influencers, and brand managers."
			route="/social-media-tools"
			mainCategorySlugs={["generators"]}
			guideTitle="Social Media Copywriting Strategy"
			guidePoints={[
				"Use bio generators to create aesthetic, formatted descriptions that match your profile brand.",
				"Generate highly readable captions with logical line breaks and emojis for better engagement.",
				"Include relevant, low-competition hashtags to increase search visibility on Instagram and TikTok.",
			]}
			faqs={[
				{ question: "How do I copy bios or captions?", answer: "Click the Copy button to instantly copy the generated bio, caption, or hashtags to your device clipboard." },
				{ question: "Do these generators use AI?", answer: "We provide template-based, heuristic, and AI-assisted generation tools to provide the best creative prompts without lag." },
				{ question: "Are there any limits on generating hashtags?", answer: "No, you can generate as many hashtags, captions, and bios as you want completely free." },
			]}
		/>
	);
}
