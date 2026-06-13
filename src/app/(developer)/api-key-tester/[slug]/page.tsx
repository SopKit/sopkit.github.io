import { notFound } from "next/navigation";
import { getToolByRoute, getRelatedTools, getAllTools } from "@/lib/tools";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ApiKeyTester from "@/components/tools/developer/ApiKeyTester";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const route = `/api-key-tester/${slug}`;
	const tool = getToolByRoute(route);

	if (!tool) return {};

	return {
		title: `${tool.seoTitle || tool.name} - API Test Utility | SopKit`,
		description: tool.seoDescription || tool.description,
		keywords: `api tester, ${tool.name.toLowerCase()}, validate api key, debug api, SopKit`,
		alternates: {
			canonical: `https://sopkit.github.io/api-key-tester/${slug}`,
		},
		openGraph: {
			title: `${tool.name} - API Test Utility | SopKit`,
			description: tool.description,
			url: `https://sopkit.github.io/api-key-tester/${slug}`,
			siteName: "SopKit",
			images: [{ url: "/og-image.jpg" }],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: `${tool.name} - API Test Utility | SopKit`,
			description: tool.description,
			images: ["/og-image.jpg"],
		},
		robots: { index: false, follow: true },
	};
}

export default async function ApiKeyTesterPage({ params }: any) {
	const { slug } = await params;
	const route = `/api-key-tester/${slug}`;
	const tool = getToolByRoute(route);

	if (!tool) {
		notFound();
	}

	const breadcrumbs = [
		{
			name: "Developer Tools",
			url: "/developer-tools",
		},
		{
			name: tool.name,
			url: route,
		},
	];

	const relatedTools = getRelatedTools(tool, 10);

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
						url: `https://sopkit.github.io/api-key-tester/${slug}`,
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>

			<ToolLayout breadcrumbs={[]}
				tool={tool}
				breadcrumbs={breadcrumbs}
				relatedTools={relatedTools}
			>
				<ApiKeyTester toolName={tool.name} />
			</ToolLayout>
		</>
	);
}

export async function generateStaticParams() {
	return getAllTools()
		.filter((t) => t.route && t.route.startsWith("/api-key-tester/"))
		.map((t) => ({
			slug: t.route.split("/").pop(),
		}));
}
