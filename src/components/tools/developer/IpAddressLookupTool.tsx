"use client";

import React, { useState, useEffect } from "react";
import { 
	GlobeIcon, 
	InfoIcon, 
	CpuIcon, 
	WifiIcon,
	Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";

export default function IpAddressLookupTool() {
	const [ipData, setIpData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [clientDetails, setClientDetails] = useState<any>(null);

	const fetchIpDetails = async () => {
		setLoading(true);
		try {
			const res = await fetch("https://ipapi.co/json/");
			if (res.ok) {
				const data = await res.json();
				setIpData(data);
			} else {
				// Fallback to simpler ipify if ipapi fails
				const ipifyRes = await fetch("https://api.ipify.org?format=json");
				if (ipifyRes.ok) {
					const ipifyData = await ipifyRes.json();
					setIpData({ ip: ipifyData.ip, country_name: "Unknown (Fallback)", org: "Unknown" });
				}
			}
		} catch (err) {
			console.error("IP lookup error:", err);
			setIpData({ ip: "Failed to detect", country_name: "Unavailable", org: "Unavailable" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchIpDetails();

		if (typeof window !== "undefined") {
			setClientDetails({
				language: window.navigator.language,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				screenSize: `${window.screen.width} x ${window.screen.height}`,
				cookiesEnabled: window.navigator.cookieEnabled ? "Yes" : "No",
				connectionType: (window.navigator as any).connection?.effectiveType || "Unknown"
			});
		}
	}, []);

	return (
		<div className="space-y-6">
			{/* Main IP Indicator */}
			<GlassCard className="p-6 text-center border-primary/20 bg-gradient-to-b from-primary/[0.02] to-transparent">
				<WifiIcon className="h-8 w-8 text-primary mx-auto mb-3 animate-pulse" />
				<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Your Public IP Address</span>
				{loading ? (
					<div className="flex items-center justify-center gap-2 mt-2">
						<Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Detecting...</span>
					</div>
				) : (
					<h2 className="text-2xl md:text-4xl font-black mt-2 text-foreground tracking-tight select-all">
						{ipData?.ip || "Detect failed"}
					</h2>
				)}
			</GlassCard>

			{/* Details Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Network Location Details */}
				<GlassCard className="p-6 space-y-4">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<GlobeIcon className="h-4 w-4" />
						<span>GeoIP Details</span>
					</div>

					<div className="divide-y divide-border/10 text-xs md:text-sm">
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Country</span>
							<span className="text-foreground font-bold">{ipData?.country_name || "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">City / Region</span>
							<span className="text-foreground">{ipData?.city ? `${ipData.city}, ${ipData.region || ""}` : "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Internet Provider (ISP)</span>
							<span className="text-foreground text-right break-words max-w-[200px]">{ipData?.org || "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Postal Code</span>
							<span className="text-foreground">{ipData?.postal || "Unavailable"}</span>
						</div>
					</div>
				</GlassCard>

				{/* Client Device Details */}
				<GlassCard className="p-6 space-y-4">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<CpuIcon className="h-4 w-4" />
						<span>Client Browser Details</span>
					</div>

					<div className="divide-y divide-border/10 text-xs md:text-sm">
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Local Timezone</span>
							<span className="text-foreground font-bold">{clientDetails?.timezone || "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Browser Language</span>
							<span className="text-foreground">{clientDetails?.language || "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Screen Resolution</span>
							<span className="text-foreground">{clientDetails?.screenSize || "Unavailable"}</span>
						</div>
						<div className="py-3 flex justify-between">
							<span className="text-muted-foreground font-semibold">Network Class</span>
							<span className="text-foreground uppercase">{clientDetails?.connectionType || "Unavailable"}</span>
						</div>
					</div>
				</GlassCard>
			</div>

			<div className="flex justify-center">
				<Button onClick={fetchIpDetails} size="sm" variant="outline" className="gap-1.5">
					Refresh Details
				</Button>
			</div>
		</div>
	);
}
