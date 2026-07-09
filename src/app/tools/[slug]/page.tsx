import { permanentRedirect, notFound } from "next/navigation";
import { getAllTools } from "@/lib/tools";

interface PageProps {
	params: Promise<{ slug: string }>;
}

// This catch-all only ever redirects to a tool's canonical route or 404s, so it
// intentionally declares no page-specific metadata (which would otherwise be a
// placeholder served during streaming).
export default async function ToolsSlugPage({ params }: PageProps) {
	const { slug } = await params;
	const tool = getAllTools().find((t) => t.id === slug || t.route === `/${slug}`);

	if (!tool) {
		notFound();
	}

	// Redirect to the canonical tool route (e.g., /image-compressor)
	permanentRedirect(tool.route);
}

export async function generateStaticParams() {
	const slugs = new Set<string>();
	getAllTools().forEach((t) => {
		if (t.id) slugs.add(t.id);
		if (t.route) slugs.add(t.route.replace(/^\//, ""));
	});
	return Array.from(slugs).map((slug) => ({ slug }));
}
