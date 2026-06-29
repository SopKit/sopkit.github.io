import ToolLayout from "@/components/tools/shared/ToolLayout";
import Fragment from "react";


export const metadata = {
	title: "Best Free ChatGPT Alternatives for Daily Tasks | SopKit",
	description: "Looking for a free ChatGPT alternative? Build a focused digital workflow for writing, coding, and image generation using our top free online tools.",
	keywords: "best free alternative to chatgpt for daily tasks, best free alternative to chatgpt for daily tasks guide, SopKit, best-free-alternative-to-chatgpt, best free alternative to chatgpt, free best-free-alternative-to-chatgpt, best free alternative to chatgpt online, SopKit guide, online tool guide, free tool category, tool directory, tool overview",
	alternates: {
		canonical: "https://sopkit.github.io/best-free-alternative-to-chatgpt/",
	},
	openGraph: {
		title: "Best Free ChatGPT Alternatives for Daily Tasks | SopKit",
		description: "Looking for a free ChatGPT alternative? Build a focused digital workflow for writing, coding, and image generation using our top free online tools.",
		url: "https://sopkit.github.io/best-free-alternative-to-chatgpt",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Best Free ChatGPT Alternatives for Daily Tasks | SopKit",
		description: "Looking for a free ChatGPT alternative? Build a focused digital workflow for writing, coding, and image generation using our top free online tools.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = {
        "id": "best-free-alternative-to-chatgpt",
        "name": "Best Free Alternative to ChatGPT for Daily Tasks",
        "description": "Looking for a free ChatGPT alternative? Build a focused stack for writing, metadata, image generation, and voice tasks with free online tools.",
        "route": "/best-free-alternative-to-chatgpt",
        "extraSlugs": [],
        "popular": false,
        "category": "content"
};

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
						url: "https://sopkit.github.io/best-free-alternative-to-chatgpt",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>

			<ToolLayout breadcrumbs={[]} tool={{ ...tool, category: "content" }}>
				<div className='min-h-[100px]'  />
			</ToolLayout>
		</>
	);
}
