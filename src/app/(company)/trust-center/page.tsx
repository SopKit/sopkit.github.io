import { SITE_URL } from "@/constants/config";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Eye, CheckCircle2, Cpu } from "lucide-react";

export const metadata = {
	title: "SopKit Trust & Safety Center — Processing & Privacy",
	description: "Learn how SopKit distinguishes local browser processing from external-service workflows and how to verify the applicable data flow on each tool page.",
	keywords: "trust center, privacy, local browser processing, data processing, security, SopKit tools",
	alternates: {
		canonical: `${SITE_URL}/trust-center/`,
	},
	openGraph: {
		title: "SopKit Trust & Safety Center — Processing & Privacy",
		description: "Learn how SopKit distinguishes local browser processing from external-service workflows and how to verify the applicable data flow on each tool page.",
		url: `${SITE_URL}/trust-center/`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SopKit Trust & Safety Center - 100% Client-Side Local Utilities",
		description: "Verify how SopKit processes your PDFs, images, and developer data securely inside your browser. No files are uploaded, 100% local, sandboxed WebAssembly execution.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function TrustCenterPage() {
	const tool = {
		id: "trust-center",
		name: "Trust & Safety Center",
		description: "Learn how SopKit distinguishes local browser processing from external-service workflows and how to verify the applicable data flow on each tool page.",
		route: "/trust-center",
		category: "company",
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: "SopKit Trust & Safety Center",
						url: `${SITE_URL}/trust-center/`,
						description: tool.description,
					}),
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool}>
				<div className="space-y-8 max-w-4xl mx-auto pb-12">
					{/* Header */}
					<div className="text-center space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
							<ShieldCheck className="h-4 w-4 text-emerald-500" />
							<span>Processing Model Transparency</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
							SopKit Trust & <span className="text-primary">Safety Center</span>
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							We believe utility tools should explain their data flow clearly. This page describes the local processing model used by applicable tools and points you to the tool-specific notice for workflows that use external services.
						</p>
					</div>

					{/* Core Pillars */}
					<div className="grid md:grid-cols-3 gap-6">
						<Card className="border border-border/40 bg-card/30 backdrop-blur-sm p-6 space-y-3">
							<Lock className="h-7 w-7 text-primary" />
							<h3 className="font-bold text-base">Local Browser Processing</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								For tools marked as local processing, file operations run in the browser session. Tool-specific pages identify when a workflow uses an external or network service.
							</p>
						</Card>
						<Card className="border border-border/40 bg-card/30 backdrop-blur-sm p-6 space-y-3">
							<Cpu className="h-7 w-7 text-primary" />
							<h3 className="font-bold text-base">WebAssembly Power</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Complex processing engines (PDF-Lib, Canvas) are loaded dynamically inside a sandboxed client thread for speed and security.
							</p>
						</Card>
						<Card className="border border-border/40 bg-card/30 backdrop-blur-sm p-6 space-y-3">
							<Eye className="h-7 w-7 text-primary" />
							<h3 className="font-bold text-base">Open-Source Verification</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								SopKit publishes its code so developers can inspect implementation details and verify the processing behavior relevant to a tool.
							</p>
						</Card>
					</div>

					{/* Detailed Sections */}
					<Card className="border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
						<CardContent className="pt-10 space-y-8 px-6 md:px-12">
							{/* Section 1 */}
							<section className="space-y-3">
								<h2 className="text-xl font-bold flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
									How Local File Isolation Works
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									When you select a file (e.g., a PDF report or a photo), the HTML5 File Reader API parses the file bytes into a local memory buffer (`ArrayBuffer`). The conversion engines run inside your browser's Javascript runtime, performing structural compression, cropping, or metadata cleanup.
								</p>
								<p className="text-sm leading-relaxed text-muted-foreground">
									When a local operation creates an output, the browser can expose the result as a local `Blob` or object URL. The exact lifecycle depends on the browser and the implementation of the individual tool.
								</p>
							</section>

							{/* Section 2 */}
							<section className="space-y-3">
								<h2 className="text-xl font-bold flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
									Privacy & Compliance Context
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									Privacy and security obligations depend on your organization, jurisdiction, contracts, and the specific processing involved. Local browser processing can reduce server-side exposure, but it does not by itself establish HIPAA, SOC 2, GDPR, or any other compliance status.
								</p>
								<p className="text-sm leading-relaxed text-muted-foreground">
									Use the processing model shown on the individual tool page when evaluating whether a workflow fits your organization's requirements. Do not assume regulatory compliance solely from the use of client-side processing.
								</p>
							</section>

							{/* Section 3 */}
							<section className="space-y-3">
								<h2 className="text-xl font-bold flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
									Verify It Yourself (Auditing Steps)
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									We encourage developers and security teams to verify our local processing claims:
								</p>
								<ol className="list-decimal list-inside text-xs text-muted-foreground space-y-2 pl-4">
									<li>Open any tool on SopKit (e.g., PDF Compressor or JSON Formatter).</li>
									<li>Press <kbd className="px-1.5 py-0.5 border border-border/50 rounded bg-muted/30 font-mono">F12</kbd> or right-click and select <strong>Inspect</strong> to open Developer Tools.</li>
									<li>Navigate to the <strong>Network</strong> tab.</li>
									<li>Select and upload your file. Perform the compression or formatting.</li>
									<li>Observe the network log and review requests associated with the specific tool. A local file operation can still coexist with analytics, consent, external APIs, or other network activity elsewhere on the page.</li>
								</ol>
							</section>
						</CardContent>
					</Card>
				</div>
			</ToolLayout>
		</>
	);
}
