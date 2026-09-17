"use client";

import { useEffect } from "react";

export function PWARegistration() {
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator &&
			window.location.hostname !== "localhost"
		) {
			const registerSW = () => {
				navigator.serviceWorker
					.register("/sw.js")
					.then((reg) => {
						if (process.env.NODE_ENV === "development") {
							console.log("✓ PWA Service Worker registered:", reg.scope);
						}
					})
					.catch((err) => {
						if (process.env.NODE_ENV === "development") {
							console.warn("PWA Service Worker registration skipped or failed:", err);
						}
					});
			};

			if (document.readyState === "complete") {
				registerSW();
			} else {
				window.addEventListener("load", registerSW);
				return () => window.removeEventListener("load", registerSW);
			}
		}
	}, []);

	return null;
}
