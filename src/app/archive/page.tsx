import { buildCanonicalUrl } from "@/seo/canonical";
import {
	CodeIcon,
	DownloadIcon,
	FileTextIcon,
	ImageIcon,
	MusicIcon,
	SearchIcon,
	SettingsIcon,
	VideoIcon,
	ZapIcon,
} from "lucide-react";
import Link from "next/link";
import toolsData from "@/constants/tools.json";

/**
 * Metadata for the Archive page.
 */
export const metadata = {
	title: "Tools Archive | SopKit",
	description:
		"Browse our complete directory of free online tools. From image editing and PDF management to SEO audit and developer utilities.",
	alternates: {
		canonical: buildCanonicalUrl("/archive"),
	},
	openGraph: {
		title: "Tools Archive | SopKit",
		description:
			"Browse our complete directory of free online tools. From image editing and PDF management to SEO audit and developer utilities.",
		url: buildCanonicalUrl("/archive"),
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Tools Archive | SopKit",
		description:
			"Browse our complete directory of free online tools. From image editing and PDF management to SEO audit and developer utilities.",
		images: ["/og-image.jpg"],
	},
	// A flat dump of every tool duplicates /tools and the category hubs;
	// keep it crawlable for link equity but out of the index.
	robots: { index: false, follow: true },
};

const categoryIcons: Record<string, any> = {
	image: ImageIcon,
	pdf: FileTextIcon,
	video: VideoIcon,
	youtube: VideoIcon,
	downloaders: DownloadIcon,
	text: FileTextIcon,
	utilities: SettingsIcon,
	seo: SearchIcon,
	developer: CodeIcon,
	audio: MusicIcon,
	generators: ZapIcon,
};

export default function ArchivePage() {
	const categories = Object.entries(toolsData.categories);

	return (
		<div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-background">
			<main className="flex-1 container mx-auto px-4 py-16 max-w-7xl">
				<header className="mb-16 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
						Tools <span className="text-primary">Archive</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						A comprehensive directory of all our processing tools, utilities,
						and search variants. Quickly find the specific solution you need.
					</p>
				</header>

				<div className="space-y-20">
					{categories.map(([key, category]: [string, any]) => {
						const Icon = categoryIcons[key] || SettingsIcon;

						return (
							<section key={key} id={key} className="scroll-mt-20">
								<div className="flex items-center gap-4 mb-8 border-b pb-4">
									<div className="p-3 ">
										<Icon className="h-8 w-8" />
									</div>
									<div>
										<h2 className="text-3xl font-bold">{category.name}</h2>
										<p className="text-muted-foreground">
											{category.description}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{category.tools.map((tool: any) => (
										<div
											key={tool.id}
											className="group p-6 bg-card shadow-xl transition-all duration-300"
										>
											<h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
												<Link href={tool.route}>{tool.name}</Link>
											</h3>
											<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
												{tool.description}
											</p>

										</div>
									))}
								</div>
							</section>
						);
					})}
				</div>
			</main>
		</div>
	);
}
