"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";
import { GA4AutoTracker } from "./GA4AutoTracker";

export function GA4RouteTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const lastTrackedUrl = useRef<string>("");

	useEffect(() => {
		const search = searchParams?.toString();
		const fullUrl = search ? `${pathname}?${search}` : pathname;

		if (lastTrackedUrl.current !== fullUrl) {
			lastTrackedUrl.current = fullUrl;
			trackPageView(fullUrl);
		}
	}, [pathname, searchParams]);

	return <GA4AutoTracker pathname={pathname} />;
}
