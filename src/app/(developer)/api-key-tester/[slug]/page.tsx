import { notFound } from "next/navigation";
import { getToolByRoute, getRelatedTools, getAllTools } from "@/lib/tools";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ApiKeyTester from "@/components/tools/developer/ApiKeyTester";
import { generateToolMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const route = `/api-key-tester/${slug}`;
	const tool = getToolByRoute(route);

	if (!tool) return {};

	return generateToolMetadata({
		name: tool.name,
		description: tool.seoDescription || tool.description,
		route: tool.route,
		category: tool.category || "developer",
	});
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
			<ToolLayout
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
