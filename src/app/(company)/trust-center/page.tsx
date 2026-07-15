import ToolLayout from "@/components/tools/shared/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Eye, CheckCircle2, Cpu, Globe } from "lucide-react";

export const metadata = {
	title: "SopKit Trust & Safety Center - 100% Client-Side Local Utilities",
	description: "Verify how SopKit processes your PDFs, images, and developer data securely inside your browser. No files are uploaded, 100% local, sandboxed WebAssembly execution.",
	keywords: "trust center, safe pdf compressor, secure document editor, HIPAA compliant pdf editor online, local code converter, gdpr compliant online tools",
	alternates: {
		canonical: "https://sopkit.github.io/trust-center/",
	},
	openGraph: {
		title: "SopKit Trust & Safety Center - 100% Client-Side Local Utilities",
		description: "Verify how SopKit processes your PDFs, images, and developer data securely inside your browser. No files are uploaded, 100% local, sandboxed WebAssembly execution.",
		url: "https://sopkit.github.io/trust-center/",
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
		description: "Learn how our client-side sandbox architecture guarantees 100% data privacy and security for all your document and developer tasks.",
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
						url: "https://sopkit.github.io/trust-center/",
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
							<span>Zero Server Uploads Guarantee</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
							SopKit Trust & <span className="text-primary">Safety Center</span>
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							We believe utility tools should respect your data ownership. Here is a technical breakdown of how we keep your documents, images, and configurations 100% private.
						</p>
					</div>

					{/* Core Pillars */}
					<div className="grid md:grid-cols-3 gap-6">
						<Card className="border border-border/40 bg-card/30 backdrop-blur-sm p-6 space-y-3">
							<Lock className="h-7 w-7 text-primary" />
							<h3 className="font-bold text-base">Client-Side Only</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Your files are processed directly inside your browser's RAM. They are never transmitted over the network to our servers.
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
							<h3 className="font-bold text-base">Fully Auditable</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Open-source code that you can inspect. Open your browser Developer Console and verify that zero network packets are sent.
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
									Once the operation completes, we instantiate a local `Blob` representation and serve it back to you via `URL.createObjectURL()`. This data resides solely in your computer's temporary memory space and is automatically garbage collected the moment you close the tab.
								</p>
							</section>

							{/* Section 2 */}
							<section className="space-y-3">
								<h2 className="text-xl font-bold flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
									Compliance & Business Standards
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									If you work in healthcare, finance, or government, uploading files to unauthorized cloud servers violates compliance frameworks such as HIPAA, SOC2, and GDPR. 
								</p>
								<p className="text-sm leading-relaxed text-muted-foreground">
									Because SopKit executes file processing locally on the client without database writes or cloud uploads, <strong className="text-foreground">your enterprise remains compliant by default</strong>. You can safely compress invoices, merge patient records, and format proprietary code without data leak risks.
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
									<li>Observe the network log—you will see that zero upload payloads or requests are generated, confirming 100% local processing.</li>
								</ol>
							</section>
						</CardContent>
					</Card>
				</div>
			</ToolLayout>
		</>
	);
}
