"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVital } from "@/lib/analytics";

export function WebVitalsReporter() {
	useReportWebVitals((metric) => {
		trackWebVital({
			id: metric.id,
			name: metric.name,
			value: metric.value,
			rating: metric.rating,
		});
	});

	return null;
}
