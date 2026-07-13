"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolToolbarProps {
	toolId: string;
	toolRoute: string;
	toolName: string;
}

export function ToolToolbar({ toolId, toolRoute, toolName }: ToolToolbarProps) {
	const [shareCopied, setShareCopied] = useState(false);
	const [stateCopied, setStateCopied] = useState(false);

	// Automated URL State Rehydration: checks if "?input=..." is present in URL and populates fields
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const inputVal = searchParams.get("input");
		if (inputVal) {
			// Find the first visible input or textarea in the tool interaction area
			setTimeout(() => {
				const activeFormEl = document.querySelector(
					"main section.bg-card\\/30 textarea, main section.bg-card\\/30 input[type='text']"
				) as HTMLTextAreaElement | HTMLInputElement | null;

				if (activeFormEl) {
					activeFormEl.value = inputVal;
					// Dispatch react-friendly input event to trigger local tool calculations
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
		// Scrape the primary textarea or input value in the tool area
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
		</div>
	);
}
