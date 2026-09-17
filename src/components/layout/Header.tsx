"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PillButton } from "@/components/ui/pill-button";
import { Container } from "@/components/layout/Container";
import { STATIC_ROUTES } from "@/lib/tools";

export function Header() {
	const pathname = usePathname();
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

	// Global shortcut Cmd+K or Ctrl+K
	const handleSearchTrigger = () => {
		const searchInput = document.querySelector<HTMLInputElement>("input[aria-label='Search all tools']");
		if (searchInput) {
			searchInput.focus();
			searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
		} else {
			window.location.href = "/search";
		}
	};

	const navItems = [
		{ label: "All Tools", href: STATIC_ROUTES.TOOLS },
		{ label: "Categories", href: "/#categories" },
		{ label: "Embeds", href: "/#embed" },
		{ label: "Guides", href: STATIC_ROUTES.TOOL_GUIDES },
		{ label: "Blog", href: STATIC_ROUTES.BLOG },
	];

	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/85 backdrop-blur-xl border-b border-border/70 py-2.5 shadow-sm"
					: "bg-transparent py-4"
			}`}
		>
			<Container size="xl">
				<div className="flex items-center justify-between gap-4">
					{/* Left: Brand Identity */}
					<Link
						href={STATIC_ROUTES.HOME}
						className="flex items-center gap-2 group no-underline text-foreground"
					>
						<span className="font-serif text-2xl font-bold tracking-tight group-hover:opacity-90 transition-opacity">
							Sop<span className="italic font-normal">Kit</span>
						</span>
						<span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-accent" />
					</Link>

					{/* Center: Floating Capsule Navigation (Desktop) */}
					<nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-muted/90 dark:bg-card/70 border border-border/80 shadow-sm backdrop-blur-md">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.label}
									href={item.href}
									className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-150 no-underline ${
										isActive
											? "bg-primary text-primary-foreground font-semibold shadow-xs"
											: "text-muted-foreground hover:text-foreground hover:bg-background/80"
									}`}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>

					{/* Right: Actions (Search, Theme, Pill CTA) */}
					<div className="flex items-center gap-2.5">
						{/* Search Pill Trigger */}
						<button
							type="button"
							onClick={handleSearchTrigger}
							className="hidden lg:inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-surface-muted/80 border border-border/70 hover:border-foreground/30 text-xs text-muted-foreground hover:text-foreground transition-all select-none cursor-pointer"
							aria-label="Search tools"
						>
							<Search className="h-3.5 w-3.5" />
							<span>Search 600+ tools...</span>
							<kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-background/80 border border-border/60 text-[10px] font-mono text-muted-foreground">
								⌘K
							</kbd>
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

						{/* Mobile Hamburger Toggle */}
						<button
							type="button"
							onClick={() => setMobileOpen(!mobileOpen)}
							className="md:hidden p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
							aria-label="Toggle navigation menu"
						>
							{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{/* Mobile Drawer */}
				{mobileOpen && (
					<div className="md:hidden mt-3 p-4 rounded-2xl bg-card border border-border shadow-xl space-y-3 animate-fade-in">
						<div className="flex flex-col gap-1">
							{navItems.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									onClick={() => setMobileOpen(false)}
									className="px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-muted transition-colors no-underline"
								>
									{item.label}
								</Link>
							))}
						</div>
						<div className="pt-2 border-t border-border flex flex-col gap-2">
							<PillButton
								href={STATIC_ROUTES.TOOLS}
								size="md"
								withArrow
								className="w-full justify-between"
								onClick={() => setMobileOpen(false)}
							>
								Explore All Tools
							</PillButton>
						</div>
					</div>
				)}
			</Container>
		</header>
	);
}
