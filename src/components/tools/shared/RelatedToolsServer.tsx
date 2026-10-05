import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { type Tool } from "@/lib/tools";

export interface RelatedToolsServerProps {
	currentTool: string;
	category?: string;
	tools?: Tool[];
	title?: string;
}

/**
 * RelatedToolsServer
 *
 * Server-rendered internal linking component that injects contextual related tools
 * directly into the initial HTML response.
 *
 * Rules:
 * - Uses semantic `<section>` and descriptive anchor links.
 * - Works 100% with JavaScript disabled.
 * - Zero client bundle weight (no "use client").
 */
export function RelatedToolsServer({
	currentTool,
	category,
	tools = [],
	title = "Related Tools & Workflows",
}: RelatedToolsServerProps) {
	const relatedTools = tools
		.filter((tool) => tool.id !== currentTool)
		.slice(0, 6);

	if (relatedTools.length === 0) {
		return null;
	}

	return (
		<section className="space-y-3 pt-6 border-t border-border/60" aria-label="Related tools">
			<div className="flex items-center justify-between">
				<h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
					<TrendingUp className="h-4 w-4 text-primary" />
					{title}
				</h2>
				<span className="text-xs text-muted-foreground font-mono">
					{relatedTools.length} utilities
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
				{relatedTools.map((tool) => (
					<Link
						key={tool.id}
						href={tool.route}
						className="group flex items-start justify-between gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-primary/40 transition-all"
					>
						<div className="flex-1 min-w-0">
							<div className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
								{tool.name}
							</div>
							<p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
								{tool.description}
							</p>
						</div>
						<ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
					</Link>
				))}
			</div>
		</section>
	);
}

export default RelatedToolsServer;
