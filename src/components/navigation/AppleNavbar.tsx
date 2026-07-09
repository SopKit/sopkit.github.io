"use client";

import { Github, LayoutGrid, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import * as React from "react";
import { useEffect, useState, Suspense } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthButton } from "./AuthButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { STATIC_ROUTES } from "@/lib/tools";

function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`${STATIC_ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
		} else {
			router.push(STATIC_ROUTES.SEARCH);
		}
	};

	return (
		<form onSubmit={handleSearch} className="relative w-full max-w-xs hidden md:block">
			<div className="relative flex items-center">
				<Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/70" />
				<Input
					type="text"
					placeholder="Search tools... (⌘K)"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="bg-muted/40 border-border/30 hover:border-border/60 text-sm h-8 pl-8 pr-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20 transition-all w-full placeholder:text-muted-foreground/50"
				/>
			</div>
		</form>
	);
}

export function AppleNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	if (pathname?.startsWith("/embed")) {
		return null;
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
				if (searchInput) {
					searchInput.focus();
					searchInput.select();
				} else {
					router.push(STATIC_ROUTES.SEARCH);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [router]);

	const categories = [
		{ name: "Features", href: STATIC_ROUTES.TOOLS },
		{ name: "Packages", href: "/packages" },
		{ name: "Pricing", href: STATIC_ROUTES.PRO },
		{ name: "Resources", href: STATIC_ROUTES.TOOL_GUIDES },
		{ name: "Blog", href: STATIC_ROUTES.BLOG },
	];

	return (
		<header className="sticky top-0 z-50 w-full h-14 bg-background/70 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
			<div className="container mx-auto h-full flex items-center justify-between px-4 max-w-7xl">
				{/* Left side */}
				<div className="flex items-center gap-6">
					<Link href={STATIC_ROUTES.HOME} className="flex items-center gap-2">
						<span className="text-lg font-bold tracking-tight text-foreground hover:opacity-85 transition-opacity">
							SopKit
						</span>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						{categories.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
							>
								{link.name}
							</Link>
						))}
					</nav>
				</div>

				{/* Center: Search */}
				<Suspense fallback={null}>
					<SearchInput />
				</Suspense>

				{/* Right side */}
				<div className="flex items-center gap-3">
					<div className="hidden sm:flex items-center gap-2">
						<ThemeToggle />

						<a
							href="https://github.com/SopKit/sopkit.github.io"
							target="_blank"
							rel="noopener noreferrer"
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							aria-label="GitHub Repository"
						>
							<Github className="h-4 w-4" />
						</a>

						<Link
							href={STATIC_ROUTES.SEARCH}
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							aria-label="Browse all tools"
						>
							<LayoutGrid className="h-4 w-4" />
						</Link>

						<Suspense fallback={<div className="h-7 w-16 bg-muted/40 rounded-md animate-pulse" />}>
							<AuthButton />
						</Suspense>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="p-1.5 text-muted-foreground hover:text-foreground md:hidden rounded-md transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="absolute top-14 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 md:hidden animate-in fade-in-50 duration-200">
					<div className="flex flex-col p-4 gap-4">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
								router.push(`${STATIC_ROUTES.SEARCH}?q=${encodeURIComponent(q.trim())}`);
								setMobileMenuOpen(false);
							}}
							className="relative"
						>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
							<Input
								name="q"
								placeholder="Search tools..."
								className="bg-muted/50 border-transparent text-foreground pl-9 w-full rounded-lg"
							/>
						</form>

						<div className="flex flex-col gap-3">
							{categories.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className="text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground py-1.5 border-b border-border/10"
									onClick={() => setMobileMenuOpen(false)}
								>
									{link.name.toUpperCase()}
								</Link>
							))}
						</div>

						<div className="flex items-center justify-between border-t border-border/20 pt-4 mt-2">
							<div className="flex items-center gap-4">
								<ThemeToggle />
								<a
									href="https://github.com/SopKit/sopkit.github.io"
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-muted-foreground hover:text-foreground"
								>
									GitHub
								</a>
							</div>
							<Suspense fallback={null}>
								<AuthButton />
							</Suspense>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
