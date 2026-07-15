"use client";


import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Code, Check, Bookmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
		return `https://sopkit.github.io${toolRoute}`;
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
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			}
		} else {
			navigator.clipboard.writeText(shareUrl);
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
			? `https://sopkit.github.io${toolRoute}?input=${encodeURIComponent(baseVal)}`
			: getShareUrl();

		navigator.clipboard.writeText(shareUrl);
		setStateCopied(true);
		setTimeout(() => setStateCopied(false), 2000);
	};

	const handleScrollToEmbed = () => {
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
			if (outcome === "accepted") {
				setIsInstallable(false);
				setDeferredPrompt(null);
			}
		}
	};

	return (
		<div className="flex items-center justify-center flex-wrap gap-2 py-1 select-none">
			<Button
				variant="outline"
				size="sm"
				onClick={handleShare}
				className="h-8 text-xs gap-1.5 rounded-full"
			>
				{shareCopied ? (
					<>
						<Check className="h-3.5 w-3.5 text-emerald-500" />
						<span>Copied Link</span>
					</>
				) : (
					<>
						<Share2 className="h-3.5 w-3.5 text-primary" />
						<span>Share Tool</span>
					</>
				)}
			</Button>

			<Button
				variant="outline"
				size="sm"
				onClick={handleCopyState}
				className="h-8 text-xs gap-1.5 rounded-full"
			>
				{stateCopied ? (
					<>
						<Check className="h-3.5 w-3.5 text-emerald-500" />
						<span>State Link Copied</span>
					</>
				) : (
					<>
						<LinkIcon className="h-3.5 w-3.5 text-primary" />
						<span>Copy Link with Inputs</span>
					</>
				)}
			</Button>

			<Button
				variant="outline"
				size="sm"
				onClick={handleScrollToEmbed}
				className="h-8 text-xs gap-1.5 rounded-full"
			>
				<Code className="h-3.5 w-3.5 text-primary" />
				<span>Embed Tool</span>
			</Button>

			<Button
				variant="outline"
				size="sm"
				onClick={handleBookmark}
				className="h-8 text-xs gap-1.5 rounded-full"
			>
				<Bookmark className="h-3.5 w-3.5 text-primary" />
				<span>Bookmark</span>
			</Button>

			{isInstallable && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleInstallApp}
					className="h-8 text-xs gap-1.5 rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
				>
					<Download className="h-3.5 w-3.5 text-primary" />
					<span>Install App</span>
				</Button>
			)}
		</div>
	);
}
