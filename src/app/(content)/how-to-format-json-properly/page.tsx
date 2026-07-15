import ToolLayout from "@/components/tools/shared/ToolLayout";
import Fragment from "react";


export const metadata = {
	title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free How to Format JSON Properly (Without Breaking Data) online. Fast, secure browser-based utility with no...",
	keywords: "how to format json properly (without breaking data), how to format json properly (without breaking data) guide, SopKit, how-to-format-json-properly, how to format json properly, free how-to-format-json-properly, how to format json properly online, SopKit guide, online tool guide, free tool category, tool directory, tool overview",
	alternates: {
		canonical: "https://sopkit.github.io/how-to-format-json-properly",
	},
	openGraph: {
		title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free How to Format JSON Properly (Without Breaking Data) online. Fast, secure browser-based utility with no...",
		url: "https://sopkit.github.io/how-to-format-json-properly",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free How to Format JSON Properly (Without Breaking Data) online. Fast, secure browser-based utility with no...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = {
        "id": "how-to-format-json-properly",
        "name": "How to Format JSON Properly (Without Breaking Data)",
        "description": "Learn how to format JSON correctly with a simple workflow for validation, cleanup, and conversion-safe output.",
        "route": "/how-to-format-json-properly",
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
						url: "https://sopkit.github.io/how-to-format-json-properly/",
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
