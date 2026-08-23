"use client";

import { useEffect, useState } from "react";
import type React from "react";

// Loads the heavy Stack SDK strictly on the client AFTER hydration.
//
// Why not next/dynamic({ ssr: false }) here? During prerender that throws
// BAILOUT_TO_CLIENT_SIDE_RENDERING, and because this provider wraps the whole
// app, React discards every server-rendered node beneath it — producing
// EMPTY page HTML for crawlers site-wide (critical SEO regression).
//
// This pattern keeps {children} fully server-rendered: the provider mounts
// around them only after hydration.
export function ClientStackAuthProvider({ children }: { children: React.ReactNode }) {
	const [AuthProvider, setAuthProvider] = useState<React.ComponentType<{
		children: React.ReactNode;
	}> | null>(null);

	useEffect(() => {
		let mounted = true;
		import("./StackAuthProvider")
			.then((mod) => {
				if (mounted) setAuthProvider(() => mod.default);
			})
			.catch(() => {
				/* stay unauthenticated rather than crash */
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (!AuthProvider) return <>{children}</>;
	return <AuthProvider>{children}</AuthProvider>;
}
