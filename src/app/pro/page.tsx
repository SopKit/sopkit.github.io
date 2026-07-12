"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProRedirectPage() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/tools/");
	}, [router]);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center text-center p-6 font-sans">
			<div className="space-y-3">
				<div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
				<h1 className="text-base font-bold text-foreground">Redirecting to Tools...</h1>
				<p className="text-xs text-muted-foreground">SopKit has retired the paid Pro tier. All tools are now 100% free.</p>
			</div>
		</div>
	);
}
