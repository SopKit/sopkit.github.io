"use client";

import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { usePathname } from "next/navigation";
import { getRouteById, STATIC_ROUTES } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";

const languages = [
	{ name: "English", code: "en" },
	{ name: "Español", code: "es" },
	{ name: "Français", code: "fr" },
	{ name: "Deutsch", code: "de" },
	{ name: "हिन्दी", code: "hi" },
	{ name: "Indonesian", code: "id" },
	{ name: "Italiano", code: "it" },
	{ name: "日本語", code: "ja" },
	{ name: "한국어", code: "ko" },
	{ name: "Português", code: "pt" },
	{ name: "Русский", code: "ru" },
	{ name: "Türkçe", code: "tr" },
	{ name: "Tiếng Việt", code: "vi" },
	{ name: "中文", code: "zh" },
	{ name: "Polski", code: "pl" },
];

interface CategoryItem {
	label: string;
	href: string;
}

export function AppleFooter({ categories = [] }: { categories?: CategoryItem[] }) {
	const pathname = usePathname();
	if (pathname?.startsWith("/embed")) {
		return null;
	}

	const footerNav = [
		{ name: "About Us", href: getRouteById("about") },
		{ name: "Contact Us", href: getRouteById("contact") },
		{ name: "Privacy Policy", href: getRouteById("privacy") },
		{ name: "Terms of Use", href: getRouteById("terms") },
		{ name: "DMCA Notice", href: "/dmca" },
	];

	return (
		<footer className="bg-background text-foreground border-t border-border/40 pt-12 pb-8">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
					{/* Brand column */}
					<div className="space-y-4">
						<Link href={STATIC_ROUTES.HOME} className="text-lg font-bold tracking-tight">
							SopKit
						</Link>
						<p className="text-xs leading-relaxed text-muted-foreground max-w-xs">
							{SITE_CONFIG.toolCountString} free tools for creators, developers, and professionals.
							Fast, browser-based, and private.
						</p>
					</div>

					{/* Platform column */}
					<div>
						<h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/80 mb-3">Platform</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link href={STATIC_ROUTES.TOOLS} className="text-muted-foreground hover:text-foreground transition-colors">
									All Features
								</Link>
							</li>
							<li>
								<Link href={STATIC_ROUTES.PRO} className="text-muted-foreground hover:text-foreground transition-colors">
									Pro Account
								</Link>
							</li>
							<li>
								<Link href={STATIC_ROUTES.TOOL_GUIDES} className="text-muted-foreground hover:text-foreground transition-colors">
									Resources
								</Link>
							</li>
							<li>
								<Link href={STATIC_ROUTES.BLOG} className="text-muted-foreground hover:text-foreground transition-colors">
									Official Blog
								</Link>
							</li>
							<li>
								<Link href="/packages" className="text-muted-foreground hover:text-foreground transition-colors">
									NPM Packages
								</Link>
							</li>
						</ul>
					</div>

					{/* Company column */}
					<div>
						<h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/80 mb-3">Company</h4>
						<ul className="space-y-2 text-xs">
							{footerNav.map((item) => (
								<li key={item.name}>
									<Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Featured & Open Source */}
					<div>
						<h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/80 mb-3">Community</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<a href={SITE_CONFIG.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
									GitHub Repository <ArrowUpRight className="h-3 w-3 opacity-60" />
								</a>
							</li>
							{/* <li>
								<a href="https://wify.my/" target="_blank" rel="noopener noreferrer nofollow" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
									Wify.my <ArrowUpRight className="h-3 w-3 opacity-60" />
								</a>
							</li> */}
							<li>
								<a href="https://linespedia.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
									Linespedia <ArrowUpRight className="h-3 w-3 opacity-60" />
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-6 border-t border-border/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; 2026 SopKit Inc. All rights reserved.
					</p>
					<div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
						<LanguageSelector languages={languages} />
					</div>
				</div>
			</div>
			<div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', border: '1px solid rgb(224, 224, 224)', borderRadius: '12px', padding: '20px', maxWidth: '500px', background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px', margin: '32px auto 0' }} className="text-left dark:bg-zinc-950 dark:border-zinc-800/80">
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
					<img alt="SopKit" src="https://ph-files.imgix.net/47198f1e-0017-4cdc-85b9-c0b00a293f45.vnd.microsoft.icon?auto=compress,format&amp;codec=mozjpeg&amp;cs=strip&amp;fit=crop&amp;h=80&amp;w=80" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
					<div style={{ flex: '1 1 0%', minWidth: '0px' }}>
						<h3 style={{ margin: '0px', fontSize: '18px', fontWeight: '600', color: 'rgb(26, 26, 26)', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="dark:text-zinc-100">SopKit</h3>
						<p style={{ margin: '4px 0px 0px', fontSize: '14px', color: 'rgb(102, 102, 102)', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} className="dark:text-zinc-400">SopKit — 460+ Free Online Tools, No Signup Required</p>
					</div>
				</div>
				<a href="https://www.producthunt.com/products/sopkit?embed=true&amp;utm_source=embed&amp;utm_medium=post_embed" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px', padding: '8px 16px', background: 'rgb(255, 97, 84)', color: 'rgb(255, 255, 255)', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>Check it out on Product Hunt →</a>
			</div>
		</footer>
	);
}
