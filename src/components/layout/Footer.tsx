"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { VisitorBadge } from "@/components/shared/VisitorBadge";
import { STATIC_ROUTES } from "@/constants/routes";
import { SITE_CONFIG } from "@/constants/config";

export function Footer() {
	const pathname = usePathname();
	if (pathname?.startsWith("/embed")) {
		return null;
	}

	const productLinks = [
		{ name: "Image Tools", href: "/image-tools" },
		{ name: "PDF Tools", href: "/pdf-tools" },
		{ name: "Developer Utilities", href: "/developer-tools" },
		{ name: "Calculators", href: "/calculators" },
		{ name: "SEO Tools", href: "/seo-tools" },
		{ name: "Text Tools", href: "/text-tools" },
	];

	const platformLinks = [
		{ name: "All 600+ Tools", href: STATIC_ROUTES.TOOLS },
		{ name: "Tool Guides", href: STATIC_ROUTES.TOOL_GUIDES },
		{ name: "NPM Packages", href: "/packages" },
		{ name: "Tool IDs & Embeds", href: STATIC_ROUTES.TOOL_ID },
		{ name: "Blog", href: STATIC_ROUTES.BLOG },
	];

	const companyLinks = [
		{ name: "About Us", href: STATIC_ROUTES.ABOUT },
		{ name: "Contact", href: STATIC_ROUTES.CONTACT },
		{ name: "Privacy Policy", href: STATIC_ROUTES.PRIVACY },
		{ name: "Editorial Policy", href: STATIC_ROUTES.EDITORIAL_POLICY },
		{ name: "Terms of Service", href: STATIC_ROUTES.TERMS },
		{ name: "DMCA Notice", href: STATIC_ROUTES.DMCA },
	];

	return (
		<footer className="border-t border-border bg-surface-muted/50 dark:bg-card/30 pt-16 pb-12 text-foreground">
			<Container size="xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-border/70">
					{/* Brand & Mission Column */}
					<div className="lg:col-span-2 space-y-4 pr-4">
						<Link
							href={STATIC_ROUTES.HOME}
							className="flex items-center gap-2.5 font-serif text-2xl font-bold tracking-tight text-foreground no-underline inline-flex"
						>
							<img
								src="/logo.png"
								alt="SopKit Logo"
								width={28}
								height={28}
								loading="lazy"
								decoding="async"
								className="w-7 h-7 rounded-md object-contain"
							/>
							<span>Sop<span className="italic font-normal">Kit</span></span>
						</Link>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
							A curated collection of over {SITE_CONFIG.toolCountString} free web utilities.
							Every tool clearly identifies where processing happens — prioritizing browser sandboxes and transparent execution.
						</p>
						<div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground font-mono">
							<span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
							<span>Browser-First Sandboxed Processing</span>
						</div>
					</div>

					{/* Products Column */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
							Tool Suites
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{productLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-foreground transition-colors no-underline"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Platform Column */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
							Platform
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{platformLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-foreground transition-colors no-underline"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Open Source Column */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
							Open Source
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a
									href={SITE_CONFIG.githubRepoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-foreground transition-colors no-underline"
								>
									Contribute on GitHub
								</a>
							</li>
							<li>
								<a
									href={SITE_CONFIG.githubOrgUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-foreground transition-colors no-underline"
								>
									SopKit GitHub Organization
								</a>
							</li>
						</ul>
					</div>

					{/* Company / Legal Column */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
							Trust & Legal
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{companyLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="hover:text-foreground transition-colors no-underline"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar: Language, Visitors & Copyright */}
				<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
					<p>© {new Date().getFullYear()} SopKit. All utilities are free to use without registration.</p>
					<div className="flex items-center gap-4">
						<VisitorBadge path="global" label="TOTAL VISITORS" />
						<button type="button" onClick={() => window.dispatchEvent(new CustomEvent("sopkit-open-consent"))} className="hover:text-foreground transition-colors">Privacy choices</button>
						<LanguageSelector />
					</div>
				</div>
			</Container>
		</footer>
	);
}
