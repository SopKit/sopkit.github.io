"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function GA4RouteTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}

		const search = searchParams?.toString();
		const fullUrl = search ? `${pathname}?${search}` : pathname;
		trackPageView(fullUrl);
	}, [pathname, searchParams]);

	return null;
}
