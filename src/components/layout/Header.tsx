"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PillButton } from "@/components/ui/pill-button";
import { Container } from "@/components/layout/Container";
import { STATIC_ROUTES } from "@/lib/tools";
import { GITHUB_REPO_URL } from "@/constants/config";
import { openUnifiedSearch } from "@/components/shared/UnifiedSearchModal";

export function Header() {
	const pathname = usePathname() || "";
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [scrolled, setScrolled] = React.useState(false);

	if (pathname?.startsWith("/embed")) {
		return null;
	}

	React.useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Close mobile menu on Escape key
	React.useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && mobileOpen) {
				setMobileOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [mobileOpen]);

	// Primary navigation items (clean, focused)
	const primaryNavItems = [
		{
			label: "Tools",
			href: STATIC_ROUTES.TOOLS,
			isActive: (p: string) => p === "/tools" || p.startsWith("/tools/"),
		},
		{
			label: "Categories",
			href: "/#categories",
			isActive: () => false,
		},
		{
			label: "Guides",
			href: STATIC_ROUTES.TOOL_GUIDES,
			isActive: (p: string) => p.startsWith("/tool-guides"),
		},
		{
			label: "Blog",
			href: STATIC_ROUTES.BLOG,
			isActive: (p: string) => p.startsWith("/blog"),
		},
	];

	const secondaryNavItems = [
		{ label: "DevSpeed Benchmarks", href: "/dev-speed" },
		{ label: "Architecture Canvas", href: "/architecture-canvas" },
		{ label: "NPM Packages", href: "/npm-packages" },
	];

	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/85 backdrop-blur-xl border-b border-border/70 py-2.5 shadow-xs"
					: "bg-transparent py-3.5 sm:py-4"
			}`}
		>
			<Container size="xl">
				<div className="flex items-center justify-between gap-3 sm:gap-4">
					{/* Logo */}
					<Link
						href={STATIC_ROUTES.HOME}
						className="flex items-center gap-2.5 group no-underline text-foreground shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
					>
						<img
							src="/logo.png"
							alt="SopKit Logo"
							width={32}
							height={32}
							fetchPriority="high"
							className="w-8 h-8 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
						/>
						<span className="font-serif text-2xl font-bold tracking-tight group-hover:opacity-90 transition-opacity">
							Sop<span className="italic font-normal">Kit</span>
						</span>
						<span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-accent" />
					</Link>

					{/* Desktop Primary Navigation */}
					<nav
						aria-label="Primary Navigation"
						className="hidden md:flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-surface-muted/90 dark:bg-card/70 border border-border/80 shadow-xs backdrop-blur-md"
					>
						{primaryNavItems.map((item) => {
							const active = item.isActive(pathname);
							return (
								<Link
									key={item.label}
									href={item.href}
									className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-150 no-underline ${
										active
											? "bg-primary text-primary-foreground font-semibold shadow-xs"
											: "text-muted-foreground hover:text-foreground hover:bg-background/80"
									}`}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>

					{/* Right-side Controls */}
					<div className="flex items-center gap-2 sm:gap-2.5">
						{/* Desktop Search Trigger Button */}
						<button
							type="button"
							onClick={openUnifiedSearch}
							className="hidden lg:inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-surface-muted/80 border border-border/70 hover:border-foreground/30 text-xs text-muted-foreground hover:text-foreground transition-all select-none cursor-pointer"
							aria-label="Search all tools (Press Command K)"
						>
							<Search className="h-3.5 w-3.5" />
							<span>Search 600+ tools...</span>
							<kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-background/80 border border-border/60 text-[10px] font-mono text-muted-foreground">
								⌘K
							</kbd>
						</button>

						{/* Mobile Search Button (Dedicated 44px+ touch target) */}
						<button
							type="button"
							onClick={openUnifiedSearch}
							className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
							aria-label="Search utilities"
						>
							<Search className="h-4.5 w-4.5" />
						</button>

						<ThemeToggle />

						<PillButton
							href={STATIC_ROUTES.TOOLS}
							size="sm"
							withArrow
							className="hidden sm:inline-flex"
						>
							Explore Tools
						</PillButton>

						{/* Mobile Menu Toggle Button */}
						<button
							type="button"
							onClick={() => setMobileOpen(!mobileOpen)}
							className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
							aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
							aria-expanded={mobileOpen}
						>
							{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation Drawer */}
				{mobileOpen && (
					<div className="md:hidden mt-3 p-4 rounded-2xl bg-card border border-border shadow-xl space-y-4 animate-in fade-in-0 zoom-in-95">
						<div className="space-y-1">
							<p className="px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
								Navigation
							</p>
							{primaryNavItems.map((item) => {
								const active = item.isActive(pathname);
								return (
									<Link
										key={item.label}
										href={item.href}
										onClick={() => setMobileOpen(false)}
										className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-colors no-underline ${
											active
												? "bg-primary/10 text-primary font-semibold"
												: "text-foreground hover:bg-muted font-medium"
										}`}
									>
										<span>{item.label}</span>
										<ArrowRight className="h-4 w-4 opacity-50" />
									</Link>
								);
							})}
						</div>

						<div className="pt-3 border-t border-border/70 space-y-1">
							<p className="px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
								More Products
							</p>
							{secondaryNavItems.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									onClick={() => setMobileOpen(false)}
									className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors no-underline"
								>
									<span>{item.label}</span>
								</Link>
							))}
							<a
								href={GITHUB_REPO_URL}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => setMobileOpen(false)}
								className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors no-underline font-medium"
							>
								<span>GitHub Repository</span>
								<ArrowRight className="h-3.5 w-3.5 opacity-50" />
							</a>
						</div>

						<div className="pt-2 border-t border-border flex flex-col gap-2">
							<PillButton
								href={STATIC_ROUTES.TOOLS}
								size="md"
								withArrow
								className="w-full justify-between"
								onClick={() => setMobileOpen(false)}
							>
								Explore All 600+ Tools
							</PillButton>
						</div>
					</div>
				)}
			</Container>
		</header>
	);
}
