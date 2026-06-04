import { permanentRedirect, redirect } from "next/navigation";
import { getAllTools } from "@/lib/tools";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function ToolsSlugPage({ params }: PageProps) {
	const { slug } = await params;
	const tool = getAllTools().find(t => t.id === slug || t.route === `/${slug}`);

	if (!tool) {
		// Let Next.js handle 404
		redirect("/not-found");
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
