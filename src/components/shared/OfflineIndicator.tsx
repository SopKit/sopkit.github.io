"use client";

import React, { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
	window.addEventListener("online", callback);
	window.addEventListener("offline", callback);
	return () => {
		window.removeEventListener("online", callback);
		window.removeEventListener("offline", callback);
	};
}

function getSnapshot() {
	return navigator.onLine;
}

function getServerSnapshot() {
	return true; // Assume online on server
}

export function OfflineIndicator() {
	const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	if (isOnline) return null;

	return (
		<aside
			aria-label="Network status alert"
			aria-live="polite"
			className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
			style={{
				backgroundColor: "rgba(180, 83, 9, 0.9)",
				color: "#ffffff",
				borderColor: "rgba(245, 158, 11, 0.4)",
			}}
		>
			<WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
			<div className="text-xs font-medium tracking-tight">
				<span className="font-semibold">Offline Mode Active</span> — Tools run 100% locally in your browser
			</div>
		</aside>
	);
}
