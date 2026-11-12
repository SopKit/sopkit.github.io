import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllToolsByCategory } from "@/lib/tools";

type Props = {
	/** Registry category key or slug accepted by getAllToolsByCategory. */
	categorySlug: string;
	/** Visible heading, e.g. "All image tools". */
	heading: string;
	/** Optional one-line intro under the heading. */
	intro?: string;
};

/**
 * Full linked list of every tool in a category, for hub pages whose pillar
 * content only hand-picks a few tools. Without this, the remaining tools in
 * the category have no internal link from their own hub (orphans). Markup
 * mirrors the grid in src/components/seo/HubPage.tsx.
 */
export default function CategoryToolGrid({ categorySlug, heading, intro }: Props) {
	const tools = getAllToolsByCategory(categorySlug);
	if (tools.length === 0) return null;

	return (
		<section aria-labelledby={`all-${categorySlug}-tools`} className="space-y-6 pt-10">
			<div className="space-y-2">
				<h2 id={`all-${categorySlug}-tools`} className="text-2xl font-bold tracking-tight md:text-3xl">
					{heading} ({tools.length})
				</h2>
				{intro && <p className="text-muted-foreground">{intro}</p>}
			</div>
			<ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tools.map((tool) => (
					<li key={tool.id}>
						<Link
							href={tool.route}
							className="group block h-full rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h3 className="text-lg font-bold group-hover:text-primary">{tool.name}</h3>
									<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
										{tool.description}
									</p>
								</div>
								<ArrowRight className="mt-8 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
							</div>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
