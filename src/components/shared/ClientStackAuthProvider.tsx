"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";

type StackAuthProviderComponent = React.ComponentType<{ children: React.ReactNode }>;

interface StackAuthBridge {
	/** Lazily loaded StackAuthProvider; null until the SDK chunk has arrived. */
	Provider: StackAuthProviderComponent | null;
	/** True once the load attempt settled (success or failure). */
	ready: boolean;
	/** Starts the SDK download; no-op after the first call. */
	load: () => void;
}

const StackAuthContext = createContext<StackAuthBridge>({
	Provider: null,
	ready: false,
	load: () => {},
});

let providerPromise: Promise<StackAuthProviderComponent | null> | null = null;

function loadStackAuthProvider(): Promise<StackAuthProviderComponent | null> {
	if (!providerPromise) {
		providerPromise = import("./StackAuthProvider")
			.then((mod) => mod.default)
			.catch(() => null); // stay unauthenticated rather than crash
	}
	return providerPromise;
}

// Root-level bridge for the Stack auth SDK.
//
// Why not next/dynamic({ ssr: false }) here? During prerender that throws
// BAILOUT_TO_CLIENT_SIDE_RENDERING, and because this provider wraps the whole
// app, React discards every server-rendered node beneath it — producing
// EMPTY page HTML for crawlers site-wide (critical SEO regression).
//
// Why not swap <>{children}</> for <AuthProvider>{children}</AuthProvider>
// once the SDK loads? Changing the element type around {children} makes React
// unmount and remount the entire app after hydration (state loss, double
// effects, layout flash). This component therefore always renders the same
// element type around its children: a context provider. The heavy
// StackProvider is mounted only at the leaf that needs it, via
// <StackAuthGate>, so the remount scope is that leaf and nothing else.
export function ClientStackAuthProvider({ children }: { children: React.ReactNode }) {
	const [Provider, setProvider] = useState<StackAuthProviderComponent | null>(null);
	const [ready, setReady] = useState(false);
	const [requested, setRequested] = useState(false);

	useEffect(() => {
		if (!requested) return;
		let mounted = true;
		loadStackAuthProvider().then((loaded) => {
			if (!mounted) return;
			setProvider(() => loaded);
			setReady(true);
		});
		return () => {
			mounted = false;
		};
	}, [requested]);

	const load = useCallback(() => setRequested(true), []);
	const bridge = useMemo<StackAuthBridge>(() => ({ Provider, ready, load }), [Provider, ready, load]);

	return <StackAuthContext.Provider value={bridge}>{children}</StackAuthContext.Provider>;
}

export function useStackAuthBridge(): StackAuthBridge {
	return useContext(StackAuthContext);
}

// Wrap any UI that calls Stack hooks (account menu, /pro account panel) in
// this gate. It requests the SDK on mount and renders its children unwrapped
// until the provider is available, so only this subtree remounts.
export function StackAuthGate({ children }: { children: React.ReactNode }) {
	const { Provider, load } = useStackAuthBridge();

	useEffect(() => {
		load();
	}, [load]);

	if (!Provider) return <>{children}</>;
	return <Provider>{children}</Provider>;
}
