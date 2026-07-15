import ToolLayout from "@/components/tools/shared/ToolLayout";
import Fragment from "react";


export const metadata = {
	title: "Free Best Free Converters in 2026 (File, Data, and Media) Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Best Free Converters in 2026 (File, Data, and Media) online. Fast, secure browser-based utility with no...",
	keywords: "best free converters in 2026 (file, data, and media), and media) guide, SopKit, best-free-converters-in-2026, best free converters in 2026, free best-free-converters-in-2026, best free converters in 2026 online, SopKit guide, online tool guide, free tool category",
	alternates: {
		canonical: "https://sopkit.github.io/best-free-converters-in-2026",
	},
	openGraph: {
		title: "Free Best Free Converters in 2026 (File, Data, and Media) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Best Free Converters in 2026 (File, Data, and Media) online. Fast, secure browser-based utility with no...",
		url: "https://sopkit.github.io/best-free-converters-in-2026",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Best Free Converters in 2026 (File, Data, and Media) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Best Free Converters in 2026 (File, Data, and Media) online. Fast, secure browser-based utility with no...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = {
        "id": "best-free-converters-in-2026",
        "name": "Best Free Converters in 2026 (File, Data, and Media)",
        "description": "The best free converters in 2026 for JSON, CSV, XML, images, and documents. No signup required.",
        "route": "/best-free-converters-in-2026",
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
						url: "https://sopkit.github.io/best-free-converters-in-2026/",
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
