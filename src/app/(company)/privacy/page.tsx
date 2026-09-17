import ToolLayout from "@/components/tools/shared/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { SITE_CONFIG } from "@/constants/config";

export const metadata = {
	title: "Privacy Policy — Transparent Data Practices | SopKit",
	description: "Learn how SopKit handles data: local browser sandbox execution for file utilities, external API disclosures for generative tools, and privacy-conscious analytics.",
	keywords: "privacy policy, SopKit privacy, data protection, browser tools privacy, local processing, client-side tools",
	alternates: {
		canonical: "https://sopkit.github.io/privacy/",
	},
	openGraph: {
		title: "Privacy Policy — Transparent Data Practices | SopKit",
		description: "Learn how SopKit handles data: local browser sandbox execution for file utilities, external API disclosures for generative tools, and privacy-conscious analytics.",
		url: "https://sopkit.github.io/privacy/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Privacy Policy — Transparent Data Practices | SopKit",
		description: "Learn how SopKit handles data: local browser sandbox execution for file utilities, external API disclosures for generative tools, and privacy-conscious analytics.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
	const tool = {
		id: "privacy",
		name: "Privacy Policy",
		description: "Read the SopKit Privacy Policy. We explain what data we collect, how local and external tools operate, and your privacy choices.",
		route: "/privacy",
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
						name: "Privacy Policy",
						description: tool.description,
						url: "https://sopkit.github.io/privacy/",
						publisher: { "@type": "Organization", name: "SopKit" },
					}),
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool} relatedTools={[]}>
				<div className="space-y-6">
					<Card>
						<CardContent className="pt-6 space-y-6">
							<div className="flex items-center gap-3 mb-6">
								<Shield className="h-8 w-8 text-primary" />
								<div>
									<h1 className="text-2xl font-bold">Privacy Policy</h1>
									<p className="text-xs text-muted-foreground">Last updated: {SITE_CONFIG.lastUpdatedDate}</p>
								</div>
							</div>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">1. Overview & Commitment to Transparency</h2>
								<p className="text-sm leading-relaxed">
									SopKit (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates <a href="https://sopkit.github.io" className="text-primary underline">sopkit.github.io</a>. We believe in providing free, fast web utilities while being completely transparent about how data is processed, which tools run locally in your browser, which tools communicate with external services, and what telemetry is collected.
								</p>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">2. Processing Models: Local vs. External Services</h2>
								<p className="text-sm leading-relaxed">
									Different tools on SopKit utilize different technical execution architectures:
								</p>
								<div className="overflow-x-auto my-4">
									<table className="w-full text-sm border-collapse border border-border">
										<thead>
											<tr className="bg-muted/50">
												<th className="border border-border p-2.5 text-left font-semibold">Tool Architecture</th>
												<th className="border border-border p-2.5 text-left font-semibold">How It Works</th>
												<th className="border border-border p-2.5 text-left font-semibold">Data Flow & Retention</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className="border border-border p-2.5 font-medium">
													Local Browser Sandbox<br />
													<span className="text-xs text-muted-foreground">(PDF merger, image compressors, code formatters, hash generators)</span>
												</td>
												<td className="border border-border p-2.5">
													Executed entirely on your local device via JavaScript, HTML5 Canvas, and WebAssembly.
												</td>
												<td className="border border-border p-2.5">
													<strong>Zero server uploads:</strong> Your files, images, and text inputs never leave your computer or browser tab.
												</td>
											</tr>
											<tr>
												<td className="border border-border p-2.5 font-medium">
													External AI / API Tools<br />
													<span className="text-xs text-muted-foreground">(e.g., AI Image Generator)</span>
												</td>
												<td className="border border-border p-2.5">
													Text prompts and dimensions are submitted to external AI synthesis providers (such as Pollinations.ai).
												</td>
												<td className="border border-border p-2.5">
													<strong>External Processing:</strong> Prompts are sent over HTTPS to the specified provider. Do not submit personal, private, or sensitive data in generation prompts.
												</td>
											</tr>
											<tr>
												<td className="border border-border p-2.5 font-medium">
													Network & Edge Proxies<br />
													<span className="text-xs text-muted-foreground">(e.g., DNS, HTTP header checks)</span>
												</td>
												<td className="border border-border p-2.5">
													Network queries that require cross-origin fetches are processed through secure edge proxy endpoints.
												</td>
												<td className="border border-border p-2.5">
													Ephemeral processing only; tool payloads and target responses are not permanently logged or retained.
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">3. Analytics & Telemetry</h2>
								<p className="text-sm leading-relaxed">
									To maintain performance, identify broken tools, and understand which utilities are most useful, we utilize privacy-conscious telemetry:
								</p>
								<ul className="list-disc list-inside text-sm space-y-1.5 ml-4">
									<li><strong>Google Analytics 4 (GA4):</strong> Aggregated page views, performance metrics, and anonymous tool lifecycle events (e.g. click counts, file format categories). We strip query parameters, tokens, and personal inputs from URLs before dispatching events.</li>
									<li><strong>Microsoft Clarity:</strong> Aggregated heatmaps and usability session replays to diagnose UX friction. Clarity is restricted from capturing sensitive tool inputs or credential forms.</li>
									<li><strong>OneDollarStats:</strong> Lightweight, cookie-free aggregated visitor metrics.</li>
								</ul>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">4. Advertising & Monetization Disclosures</h2>
								<p className="text-sm leading-relaxed">
									SopKit may display contextual or banner advertisements to support ongoing maintenance and infrastructure costs:
								</p>
								<ul className="list-disc list-inside text-sm space-y-1.5 ml-4">
									<li><strong>Google AdSense:</strong> When active, Google and third-party vendors use cookies or device identifiers to serve ads based on your visit history. Users in applicable regions (such as the EEA, UK, and Switzerland) can manage consent preferences.</li>
									<li><strong>Ad Exclusions:</strong> Advertising scripts are strictly disabled on credential tools, password generators, and sensitive developer utilities.</li>
								</ul>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">5. What We Never Do</h2>
								<ul className="list-disc list-inside text-sm space-y-1 ml-4">
									<li>We never sell, rent, or trade your document or file contents to data brokers.</li>
									<li>We never train machine learning models on your local sandboxed files or documents.</li>
									<li>We never require account registration, passwords, or credit card information to access core utilities.</li>
								</ul>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">6. User Choices & Data Rights</h2>
								<p className="text-sm leading-relaxed">
									You have complete control over your browser data:
								</p>
								<ul className="list-disc list-inside text-sm space-y-1 ml-4">
									<li><strong>Local Storage:</strong> Recent generation history and favorites are stored solely in your browser&apos;s localStorage and can be deleted at any time through tool settings or browser history clearing.</li>
									<li><strong>Analytics Opt-Out:</strong> You may block analytics using browser tracking protection, content blockers, or ad-blocking extensions without impacting tool functionality.</li>
								</ul>
							</section>

							<section className="space-y-3">
								<h2 className="text-lg font-semibold">7. Contact & Inquiries</h2>
								<p className="text-sm leading-relaxed">
									If you have any questions or feedback regarding our privacy practices, please contact us at:
								</p>
								<ul className="text-sm space-y-1 ml-4">
									<li>Email: <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-primary underline">{SITE_CONFIG.contactEmail}</a></li>
									<li>GitHub: <a href={SITE_CONFIG.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{SITE_CONFIG.githubRepoUrl}</a></li>
								</ul>
							</section>
						</CardContent>
					</Card>
				</div>
			</ToolLayout>
		</>
	);
}
