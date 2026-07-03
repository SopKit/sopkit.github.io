import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MarkdownToText from "@/components/tools/text/MarkdownToText";

export const metadata = {
	title: "Markdown to Text Online Free - No Signup | SopKit",
	description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-text/",
	},
	openGraph: {
		title: "Markdown to Text Online Free - No Signup",
		description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% pri",
		url: "https://sopkit.github.io/markdown-to-text",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Markdown to Text Online Free - Fast & Secure",
		description: "Convert Markdown formatted text to clean plain text instantly. Perfect for cleaning up content from ChatGPT, Claude, and GitHub. No signup, no uploads, 100% pri",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/markdown-to-text");

	if (!tool) {
		return notFound();
	}

	const appSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "Markdown to Text Converter",
		"url": "https://sopkit.github.io/markdown-to-text/",
		"applicationCategory": "TextApplication",
		"operatingSystem": "All",
		"browserRequirements": "Requires HTML5 support",
		"description": "Convert Markdown formatted text to clean plain text instantly. Ideal for cleaning up content from AI bots like ChatGPT, Claude, and Github.",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Is my text data stored or sent to any server?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "No, all conversion logic is executed in your local browser using client-side JavaScript. Your text data is never sent to our servers or stored anywhere."
				}
			},
			{
				"@type": "Question",
				"name": "Why convert Markdown to plain text?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Converting Markdown to plain text is extremely useful for stripping bold headers, asterisks, brackets, and syntax characters when copy-pasting code outputs, emails, or blog articles to other platforms."
				}
			}
		]
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool}>
				<MarkdownToText />
			</ToolLayout>
		</>
	);
}
