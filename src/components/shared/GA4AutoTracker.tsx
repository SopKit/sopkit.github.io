"use client";

import { useEffect, useRef } from "react";
import {
	initGAUserProperties,
	trackScrollDepth,
	trackEngagementTime,
	trackOutboundClick,
	trackDownload,
	trackCopyToClipboard,
	trackNetworkStatusChange,
	trackError,
} from "@/lib/analytics";

interface GA4AutoTrackerProps {
	pathname: string;
}

export function GA4AutoTracker({ pathname }: GA4AutoTrackerProps) {
	const triggeredScrollMilestones = useRef<Set<number>>(new Set());
	const activeSecondsRef = useRef<number>(0);
	const pathnameRef = useRef<string>(pathname);

	useEffect(() => {
		pathnameRef.current = pathname;
	}, [pathname]);

	// 1. One-time initialization of GA4 Custom User Properties & Global Listeners
	useEffect(() => {
		// Initialize client user properties cohort
		initGAUserProperties();

		// Click delegation for Outbound Links & File Downloads
		const handleDocumentClick = (event: MouseEvent) => {
			try {
				const target = (event.target as Element)?.closest?.("a");
				if (!target || !target.href) return;

				const targetUrl = new URL(target.href, window.location.origin);
				const currentOrigin = window.location.origin;

				// Outbound link check
				if (
					targetUrl.origin !== currentOrigin &&
					!target.href.startsWith("mailto:") &&
					!target.href.startsWith("tel:") &&
					!target.href.startsWith("javascript:")
				) {
					const linkText =
						target.textContent?.trim() ||
						target.getAttribute("aria-label") ||
						target.getAttribute("title") ||
						"external_link";
					trackOutboundClick(target.href, linkText);
				}

				// Download detection (attribute or file extension match)
				const isDownloadAttr = target.hasAttribute("download");
				const pathnameLower = targetUrl.pathname.toLowerCase();
				const extMatch = pathnameLower.match(
					/\.(pdf|png|jpg|jpeg|webp|svg|zip|gz|json|csv|mp3|wav|mp4|webm|ico|txt|md|wasm)$/i
				);

				if (isDownloadAttr || extMatch) {
					const ext = extMatch
						? extMatch[1]
						: target.getAttribute("download")?.split(".").pop() || "unknown";
					const toolId = pathnameRef.current.replace(/^\//, "").split("/")[0] || "site";
					const downloadName = target.getAttribute("download") || targetUrl.pathname.split("/").pop();
					trackDownload(toolId, ext, undefined, downloadName);
				}
			} catch {
				// Prevent any click interceptor error from blocking navigation
			}
		};

		// Clipboard copy listener
		const handleCopy = () => {
			const toolId = pathnameRef.current.replace(/^\//, "").split("/")[0] || "site";
			trackCopyToClipboard(toolId, "selection");
		};

		// Online / Offline connectivity listener
		const handleOnline = () => {
			trackNetworkStatusChange("online", pathnameRef.current);
		};
		const handleOffline = () => {
			trackNetworkStatusChange("offline", pathnameRef.current);
		};

		// Global Uncaught Window Errors
		const handleWindowError = (event: ErrorEvent) => {
			if (event.message) {
				trackError("uncaught_error", event.message, pathnameRef.current);
			}
		};

		// Global Unhandled Promise Rejections
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			const reasonMsg =
				typeof event.reason === "string"
					? event.reason
					: event.reason?.message || "unhandled_promise_rejection";
			trackError("unhandled_rejection", reasonMsg, pathnameRef.current);
		};

		document.addEventListener("click", handleDocumentClick, { passive: true });
		document.addEventListener("copy", handleCopy, { passive: true });
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		window.addEventListener("error", handleWindowError);
		window.addEventListener("unhandledrejection", handleUnhandledRejection);

		return () => {
			document.removeEventListener("click", handleDocumentClick);
			document.removeEventListener("copy", handleCopy);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("error", handleWindowError);
			window.removeEventListener("unhandledrejection", handleUnhandledRejection);
		};
	}, []);

	// 2. Active Tab Engagement Heartbeat & Flush on Leave
	useEffect(() => {
		activeSecondsRef.current = 0;

		const flushEngagement = () => {
			if (activeSecondsRef.current >= 2) {
				trackEngagementTime(activeSecondsRef.current, pathname);
				activeSecondsRef.current = 0;
			}
		};

		// Tick every 2 seconds when tab is active and visible
		const intervalId = window.setInterval(() => {
			if (document.visibilityState === "visible" && (document.hasFocus ? document.hasFocus() : true)) {
				activeSecondsRef.current += 2;
				if (activeSecondsRef.current >= 30) {
					trackEngagementTime(30, pathname);
					activeSecondsRef.current -= 30;
				}
			}
		}, 2000);

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				flushEngagement();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("pagehide", flushEngagement);
		window.addEventListener("beforeunload", flushEngagement);

		return () => {
			window.clearInterval(intervalId);
			flushEngagement();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("pagehide", flushEngagement);
			window.removeEventListener("beforeunload", flushEngagement);
		};
	}, [pathname]);

	// 3. Scroll Depth Milestone Tracker (25%, 50%, 75%, 90%, 100%)
	useEffect(() => {
		triggeredScrollMilestones.current = new Set();
		let ticking = false;

		const checkScroll = () => {
			const scrollHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			if (scrollHeight <= 0) return;

			const percent = Math.min(
				100,
				Math.round((window.scrollY / scrollHeight) * 100)
			);

			const milestones: Array<25 | 50 | 75 | 90 | 100> = [25, 50, 75, 90, 100];
			for (const milestone of milestones) {
				if (
					percent >= milestone &&
					!triggeredScrollMilestones.current.has(milestone)
				) {
					triggeredScrollMilestones.current.add(milestone);
					trackScrollDepth(milestone, pathname);
				}
			}
		};

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					checkScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		// Initial check in case page is loaded already scrolled or short
		checkScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [pathname]);

	return null;
}
