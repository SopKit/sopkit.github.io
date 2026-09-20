import { SITE_URL } from "@/constants/config";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Globe, Lock, Zap, Users, ShieldAlert, CheckCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants/config";

export const metadata = {
	title: "About SopKit — Privacy-First Free Online Tools Platform",
	description: `Learn about SopKit — the privacy-first free online tools platform with ${SITE_CONFIG.toolCountString} browser-based utilities. No signup, no uploads, 100% client-side processing for images, PDFs, videos, and more.`,
	keywords: "about SopKit, client-side tools, private online utility, no upload pdf editor, local image converter, browser sandbox tools, secure developer tools, open source browser utilities",
	alternates: {
		canonical: `${SITE_CONFIG.siteUrl}/about/`,
	},
	openGraph: {
		title: "About SopKit — Privacy-First Free Online Tools Platform",
		description: `Learn about SopKit — the privacy-first free online tools platform with ${SITE_CONFIG.toolCountString} browser-based utilities. No signup, no uploads, 100% client-side processing.`,
		url: `${SITE_CONFIG.siteUrl}/about/`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "About SopKit — Privacy-First Free Online Tools Platform",
		description: `Learn about SopKit — the privacy-first free online tools platform with ${SITE_CONFIG.toolCountString} browser-based utilities. No signup, no uploads, 100% client-side processing.`,
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function AboutPage() {
	const tool = {
		id: "about",
		name: "About SopKit",
		description: `SopKit is a privacy-focused, browser-first utility platform. We offer ${SITE_CONFIG.toolCountString} free tools for PDF, image, text, and code—processed entirely inside your browser sandbox.`,
		route: "/about",
		category: "company",
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "SopKit",
						url: SITE_URL,
						description: tool.description,
						sameAs: ["https://github.com/SH20RAJ/SopKit"],
					}),
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool}>
				<div className="space-y-8 max-w-4xl mx-auto">
					<Card className="border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
						<CardContent className="pt-10 space-y-8 px-6 md:px-12">
							<div className="text-center space-y-4">
								{/* H1 is rendered by ToolLayout above; this tagline stays a paragraph-level heading */}
								<p className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
									The <span className="text-primary">Privacy-First</span> Utility Platform
								</p>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
									SopKit was built with a radical idea: you should not have to upload your private files, bank statements, photos, or API credentials to third-party servers just to perform daily utility tasks.
								</p>
							</div>

							<div className="grid md:grid-cols-2 gap-4 text-center">
								<div className="p-6 border border-border/30 bg-muted/10 rounded-2xl space-y-1">
									<Lock className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
									<div className="text-2xl font-black">100% Client-Side</div>
									<div className="text-xs text-muted-foreground">Processed inside your browser memory sandbox</div>
								</div>
								<div className="p-6 border border-border/30 bg-muted/10 rounded-2xl space-y-1">
									<Zap className="h-8 w-8 text-primary mx-auto mb-2" />
									<div className="text-2xl font-black">Instant Speed</div>
									<div className="text-xs text-muted-foreground">Zero upload queue, zero network round-trip delays</div>
								</div>
							</div>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border/20 pb-2">
									<ShieldAlert className="h-5 w-5 text-primary" /> Our Core Differentiator
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									Unlike conventional cloud-based utility platforms (like iLovePDF, Smallpdf, or CloudConvert) that require transferring your document files onto remote servers, <strong className="text-foreground">SopKit processes your data locally in your browser memory space</strong>. By utilizing modern web tech like <strong className="text-foreground">WebAssembly, Canvas contexts, and HTML5 file APIs</strong>, we compile and optimize your documents locally. Your sensitive information never touches our servers.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border/20 pb-2">
									<CheckCircle className="h-5 w-5 text-primary" /> Why Users Trust SopKit
								</h2>
								<div className="grid md:grid-cols-2 gap-6">
									<div className="flex gap-3 p-5 border border-border/30 bg-muted/10 rounded-2xl">
										<Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
										<div>
											<h3 className="font-bold text-sm text-foreground">Browser-First Processing</h3>
											<p className="text-xs text-muted-foreground mt-1">For tools marked as local processing, the core operation runs in your browser. Tools that use external services identify that processing model on the page.</p>
										</div>
									</div>
									<div className="flex gap-3 p-5 border border-border/30 bg-muted/10 rounded-2xl">
										<Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
										<div>
											<h3 className="font-bold text-sm text-foreground">Efficient Local Processing</h3>
											<p className="text-xs text-muted-foreground mt-1">Some local tools can continue processing after the required page assets have loaded, but availability depends on the browser and the individual tool.</p>
										</div>
									</div>
									<div className="flex gap-3 p-5 border border-border/30 bg-muted/10 rounded-2xl">
										<Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
										<div>
											<h3 className="font-bold text-sm text-foreground">Open-Source Transparency</h3>
											<p className="text-xs text-muted-foreground mt-1">Every utility is open source and verifiable. Anyone can inspect our network requests tab to verify that no files are being sent.</p>
										</div>
									</div>
									<div className="flex gap-3 p-5 border border-border/30 bg-muted/10 rounded-2xl">
										<Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
										<div>
											<h3 className="font-bold text-sm text-foreground">No Signup or Limits</h3>
											<p className="text-xs text-muted-foreground mt-1">Free forever with zero registration barriers, no premium paywalls, and no hidden upload queues.</p>
										</div>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border/20 pb-2">
									<Globe className="h-5 w-5 text-primary" /> Custom Embed Widgets
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									Every tool on our platform can be embedded directly onto other websites using standard iframe codes. Because they run entirely on the client, they do not require API configuration and are fully free to distribute.
								</p>
							</section>

							<section className="space-y-4 pt-4 border-t border-border/20">
								<h2 className="text-2xl font-bold text-foreground">Supporting Open Source</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									SopKit is built on open-source values and welcomes contributions from developers worldwide. Check out our GitHub repository to report bugs, suggest features, or build new tools for our directory.
								</p>
								<div className="flex flex-wrap gap-3 pt-2">
									<a
										href="https://github.com/SH20RAJ/SopKit"
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
									>
										<Code className="h-4.5 w-4.5" />
										View Project on GitHub
									</a>
									<a
										href="/contact"
										className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:bg-muted/40 rounded-xl text-sm font-bold transition-all"
									>
										Contact Team
									</a>
								</div>
							</section>
						</CardContent>
					</Card>
				</div>
			</ToolLayout>
		</>
	);
}
