"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, CheckCircle2 } from "lucide-react";

export function OfflineIndicator() {
	const [isOffline, setIsOffline] = useState(false);
	const [justReconnected, setJustReconnected] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleOffline = () => {
			setIsOffline(true);
			setJustReconnected(false);
		};

		const handleOnline = () => {
			setIsOffline(false);
			setJustReconnected(true);
			const timer = setTimeout(() => setJustReconnected(false), 4000);
			return () => clearTimeout(timer);
		};

		// Check initial state
		if (!navigator.onLine) {
			setIsOffline(true);
		}

		window.addEventListener("offline", handleOffline);
		window.addEventListener("online", handleOnline);

		return () => {
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("online", handleOnline);
		};
	}, []);

	if (!isOffline && !justReconnected) return null;

	return (
		<aside
			aria-label="Network status alert"
			aria-live="polite"
			className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
			style={{
				backgroundColor: isOffline ? "rgba(180, 83, 9, 0.9)" : "rgba(16, 185, 129, 0.9)",
				color: "#ffffff",
				borderColor: isOffline ? "rgba(245, 158, 11, 0.4)" : "rgba(52, 211, 153, 0.4)",
			}}
		>
			{isOffline ? (
				<>
					<WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
					<div className="text-xs font-medium tracking-tight">
						<span className="font-semibold">Offline Mode</span> — Tools run 100% locally in your browser
					</div>
				</>
			) : (
				<>
					<CheckCircle2 className="w-4 h-4 text-emerald-100" />
					<div className="text-xs font-medium tracking-tight">
						<span className="font-semibold">Back Online</span> — Connection restored
					</div>
				</>
			)}
		</aside>
	);
}
