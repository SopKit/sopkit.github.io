"use client";

/**
 * @file src/components/tools/shared/ToolToolbar.tsx
 * @description Action toolbar for tool pages.
 * Features real localStorage favorite persistence, quick URL sharing,
 * embed widget scrolling, and PWA installation.
 */

import { useState, useEffect } from "react";
import {
	Share2,
	Link as LinkIcon,
	Code,
	Check,
	Star,
	Download,
	Maximize2,
	Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	trackCopyToClipboard,
	trackEmbedInteraction,
	trackShare,
	trackPWAInstall,
} from "@/lib/analytics";
import { SITE_URL } from "@/constants/config";
import { useUserToolbox } from "@/hooks/useUserToolbox";

interface ToolToolbarProps {
	toolId: string;
	toolRoute: string;
	toolName: string;
	category?: string;
}

export function ToolToolbar({ toolId, toolRoute, toolName, category }: ToolToolbarProps) {
	const [shareCopied, setShareCopied] = useState(false);
	const [stateCopied, setStateCopied] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const { isFavorite, toggleFavorite, recordRecent } = useUserToolbox();
	const favorited = isFavorite(toolId);

	// Record tool in user toolbox on mount
	useEffect(() => {
		recordRecent({
			id: toolId,
			name: toolName,
			route: toolRoute,
			category,
		});
	}, [toolId, toolName, toolRoute, category, recordRecent]);

	// PWA Install prompt listener
	useEffect(() => {
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setIsInstallable(true);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstall);
		return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
	}, []);

	// Automated URL State Rehydration: checks if "?input=..." is present in URL
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const inputVal = searchParams.get("input");
		if (inputVal) {
			setTimeout(() => {
				const activeFormEl = document.querySelector(
					"main textarea, main input[type='text']"
				) as HTMLTextAreaElement | HTMLInputElement | null;

				if (activeFormEl) {
					activeFormEl.value = inputVal;
					const event = new Event("input", { bubbles: true });
					activeFormEl.dispatchEvent(event);
				}
			}, 300);
		}
	}, []);

	const getShareUrl = () => {
		return `${SITE_URL}${toolRoute}`;
	};

	const handleShare = async () => {
		const shareUrl = getShareUrl();
		if (navigator.share) {
			try {
				await navigator.share({
					title: toolName,
					text: `Check out this free online ${toolName} on SopKit!`,
					url: shareUrl,
				});
				trackShare(toolId, "native_share");
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			}
		} else {
			navigator.clipboard.writeText(shareUrl);
			trackCopyToClipboard(toolId, "url");
			trackShare(toolId, "clipboard");
			setShareCopied(true);
			toast.success("Tool link copied to clipboard!");
			setTimeout(() => setShareCopied(false), 2000);
		}
	};

	const handleCopyState = () => {
		const activeFormEl = document.querySelector(
			"main textarea, main input[type='text']"
		) as HTMLTextAreaElement | HTMLInputElement | null;

		const baseVal = activeFormEl ? activeFormEl.value.trim() : "";
		const shareUrl = baseVal
			? `${SITE_URL}${toolRoute}?input=${encodeURIComponent(baseVal)}`
			: getShareUrl();

		navigator.clipboard.writeText(shareUrl);
		trackCopyToClipboard(toolId, "url");
		trackShare(toolId, "clipboard");
		setStateCopied(true);
		toast.success("Shareable link with your input copied!");
		setTimeout(() => setStateCopied(false), 2000);
	};

	const handleScrollToEmbed = () => {
		trackEmbedInteraction(toolId, "tab_switch");
		const embedSection = document.querySelector("#embed-widget-giver, section[class*='border-border/40']");
		if (embedSection) {
			embedSection.scrollIntoView({ behavior: "smooth", block: "center" });
		} else {
			toast.info("Embed code available below in documentation.");
		}
	};

	const handleToggleFavorite = () => {
		toggleFavorite(toolId);
		if (!favorited) {
			toast.success(`Added ${toolName} to your SopKit Toolbox!`);
		} else {
			toast.info(`Removed ${toolName} from favorites.`);
		}
	};

	const handleToggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
		} else {
			document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
		}
	};

	const handleInstallApp = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			trackPWAInstall(outcome === "accepted" ? "accepted" : "dismissed");
			if (outcome === "accepted") {
				setIsInstallable(false);
				setDeferredPrompt(null);
			}
		}
	};

	return (
		<div className="flex items-center flex-wrap justify-center sm:justify-end gap-1.5 select-none text-xs text-muted-foreground">
			{/* Real 1-Click Favorite Toggle */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleToggleFavorite}
				className={`h-7.5 text-xs px-2.5 gap-1.5 rounded-lg border transition-colors cursor-pointer ${
					favorited
						? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold"
						: "border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
				}`}
				aria-label={favorited ? "Remove from favorite tools" : "Save to my toolbox favorites"}
			>
				<Star className={`h-3.5 w-3.5 ${favorited ? "fill-amber-500 text-amber-500" : ""}`} />
				<span>{favorited ? "Favorited" : "Favorite"}</span>
			</Button>

			{/* Share Link */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleShare}
				className="h-7.5 text-xs px-2.5 gap-1.5 rounded-lg border border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
				aria-label="Share this tool"
			>
				{shareCopied ? (
					<>
						<Check className="h-3.5 w-3.5 text-emerald-500" />
						<span className="font-medium text-emerald-600 dark:text-emerald-400">Copied</span>
					</>
				) : (
					<>
						<Share2 className="h-3.5 w-3.5" />
						<span>Share</span>
					</>
				)}
			</Button>

			{/* Copy State Link */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleCopyState}
				className="hidden sm:inline-flex h-7.5 text-xs px-2.5 gap-1.5 rounded-lg border border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
				aria-label="Copy direct link with current input"
			>
				{stateCopied ? (
					<>
						<Check className="h-3.5 w-3.5 text-emerald-500" />
						<span className="font-medium text-emerald-600 dark:text-emerald-400">Copied</span>
					</>
				) : (
					<>
						<LinkIcon className="h-3.5 w-3.5" />
						<span>Link State</span>
					</>
				)}
			</Button>

			{/* Embed Widget */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleScrollToEmbed}
				className="hidden sm:inline-flex h-7.5 text-xs px-2.5 gap-1.5 rounded-lg border border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
				aria-label="Embed this utility"
			>
				<Code className="h-3.5 w-3.5" />
				<span>Embed</span>
			</Button>

			{/* Zen / Fullscreen Toggle */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleToggleFullscreen}
				className="hidden md:inline-flex h-7.5 text-xs px-2.5 gap-1.5 rounded-lg border border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
				aria-label={isFullscreen ? "Exit fullscreen" : "Full screen zen mode"}
			>
				{isFullscreen ? (
					<Minimize2 className="h-3.5 w-3.5" />
				) : (
					<Maximize2 className="h-3.5 w-3.5" />
				)}
				<span>{isFullscreen ? "Exit" : "Zen"}</span>
			</Button>

			{isInstallable && (
				<Button
					variant="ghost"
					size="sm"
					onClick={handleInstallApp}
					className="h-7.5 text-xs px-2.5 gap-1.5 rounded-lg text-primary font-medium hover:bg-primary/10 transition-colors cursor-pointer"
				>
					<Download className="h-3.5 w-3.5" />
					<span>Install</span>
				</Button>
			)}
		</div>
	);
}
