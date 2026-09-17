"use client";


import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Code, Check, Bookmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trackCopyToClipboard, trackEmbedInteraction, trackShare, trackPWAInstall } from "@/lib/analytics";
import { SITE_URL } from "@/constants/config";

interface ToolToolbarProps {
	toolId: string;
	toolRoute: string;
	toolName: string;
}

export function ToolToolbar({ toolId, toolRoute, toolName }: ToolToolbarProps) {
	const [shareCopied, setShareCopied] = useState(false);
	const [stateCopied, setStateCopied] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);

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

	// Automated URL State Rehydration: checks if "?input=..." is present in URL and populates fields
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const inputVal = searchParams.get("input");
		if (inputVal) {
			setTimeout(() => {
				const activeFormEl = document.querySelector(
					"main section.bg-card\\/30 textarea, main section.bg-card\\/30 input[type='text']"
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
			setTimeout(() => setShareCopied(false), 2000);
		}
	};

	const handleCopyState = () => {
		const activeFormEl = document.querySelector(
			"main section.bg-card\\/30 textarea, main section.bg-card\\/30 input[type='text']"
		) as HTMLTextAreaElement | HTMLInputElement | null;

		const baseVal = activeFormEl ? activeFormEl.value.trim() : "";
		const shareUrl = baseVal
			? `${SITE_URL}${toolRoute}?input=${encodeURIComponent(baseVal)}`
			: getShareUrl();

		navigator.clipboard.writeText(shareUrl);
		trackCopyToClipboard(toolId, "url");
		trackShare(toolId, "clipboard");
		setStateCopied(true);
		setTimeout(() => setStateCopied(false), 2000);
	};

	const handleScrollToEmbed = () => {
		trackEmbedInteraction(toolId, "tab_switch");
		const embedSection = document.querySelector("section[class*='border-border/40']");
		if (embedSection) {
			embedSection.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	const handleBookmark = () => {
		toast.info("Press Cmd + D (or Ctrl + D) to bookmark this tool in your browser!", {
			duration: 4000,
		});
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
		<div className="flex items-center flex-wrap justify-center sm:justify-end gap-1 select-none text-xs text-muted-foreground">
			<Button
				variant="ghost"
				size="sm"
				onClick={handleShare}
				className="h-7 text-xs px-2.5 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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

			<Button
				variant="ghost"
				size="sm"
				onClick={handleCopyState}
				className="h-7 text-xs px-2.5 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
			>
				{stateCopied ? (
					<>
						<Check className="h-3.5 w-3.5 text-emerald-500" />
						<span className="font-medium text-emerald-600 dark:text-emerald-400">Copied Link</span>
					</>
				) : (
					<>
						<LinkIcon className="h-3.5 w-3.5" />
						<span>Copy Link</span>
					</>
				)}
			</Button>

			<Button
				variant="ghost"
				size="sm"
				onClick={handleScrollToEmbed}
				className="h-7 text-xs px-2.5 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
			>
				<Code className="h-3.5 w-3.5" />
				<span>Embed</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				onClick={handleBookmark}
				className="h-7 text-xs px-2.5 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
			>
				<Bookmark className="h-3.5 w-3.5" />
				<span>Bookmark</span>
			</Button>

			{isInstallable && (
				<Button
					variant="ghost"
					size="sm"
					onClick={handleInstallApp}
					className="h-7 text-xs px-2.5 gap-1.5 rounded-lg text-primary font-medium hover:bg-primary/10 transition-colors"
				>
					<Download className="h-3.5 w-3.5" />
					<span>Install</span>
				</Button>
			)}
		</div>
	);
}
