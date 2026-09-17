"use client";

import { Check, Copy, Globe, MapPin, RefreshCw, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function IPLocationFinderTool() {
	const [ipInfo, setIpInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const getIPLocation = async () => {
		setLoading(true);
		try {
			// Using a free IP geolocation service
			const response = await fetch("https://ipapi.co/json/");
			const data: any = await response.json();

			const ipData = {
				ip: data.ip,
				city: data.city,
				region: data.region,
				country: data.country_name,
				countryCode: data.country_code,
				postal: data.postal,
				latitude: data.latitude,
				longitude: data.longitude,
				timezone: data.timezone,
				isp: data.org,
				asn: data.asn,
				currency: data.currency,
				language: data.languages,
				continent: data.continent_code,
			};

			setIpInfo(ipData);
			toast.success("IP location information retrieved!");
		} catch (error) {
			toast.error("Failed to get IP location information");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy");
		}
	};

	useEffect(() => {
		getIPLocation();
	}, [getIPLocation]);

	return (
		<div className="max-w-4xl mx-auto space-y-5">
			{loading ? (
				<Card className="border-border/60 p-12 text-center">
					<RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
					<p className="text-sm font-medium text-muted-foreground">
						Detecting your network address and geolocation...
					</p>
				</Card>
			) : ipInfo ? (
				<div className="space-y-5">
					{/* Hero IP Inspection Card */}
					<Card className="border-border/60 shadow-sm overflow-hidden bg-gradient-to-b from-card/80 to-card">
						<CardContent className="p-6">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
								<div className="space-y-1 text-center sm:text-left">
									<div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
										Active Public IP Address
									</div>
									<div className="flex items-center justify-center sm:justify-start gap-3">
										<span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-foreground select-all">
											{ipInfo.ip}
										</span>
										<Button
											onClick={() => copyToClipboard(ipInfo.ip)}
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
											title="Copy IP"
										>
											{copied ? (
												<Check className="h-4 w-4 text-emerald-500" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</div>
									<p className="text-xs text-muted-foreground">
										{ipInfo.isp} • {ipInfo.city ? `${ipInfo.city}, ` : ""}{ipInfo.country}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<Button
										onClick={getIPLocation}
										variant="outline"
										size="sm"
										className="h-9 font-medium"
									>
										<RefreshCw className="h-3.5 w-3.5 mr-1.5" />
										Refresh
									</Button>
									{ipInfo.latitude && ipInfo.longitude && (
										<Button
											onClick={() =>
												window.open(
													`https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`,
													"_blank",
													"noopener,noreferrer",
												)
											}
											size="sm"
											className="h-9 font-medium"
										>
											<MapPin className="h-3.5 w-3.5 mr-1.5" />
											Open Maps
										</Button>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Geolocation & Network Specifications Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Location Details Card */}
						<Card className="border-border/60 shadow-sm">
							<CardHeader className="py-3 px-4 border-b border-border/40">
								<CardTitle className="text-sm font-semibold flex items-center gap-2">
									<MapPin className="h-4 w-4 text-primary" />
									Physical Geolocation
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 space-y-2.5 text-xs">
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">City</span>
									<span className="font-medium text-foreground">{ipInfo.city || "Unknown"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Region / State</span>
									<span className="font-medium text-foreground">{ipInfo.region || "Unknown"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Country</span>
									<div className="flex items-center gap-1.5 font-medium text-foreground">
										<span>{ipInfo.country}</span>
										{ipInfo.countryCode && (
											<Badge variant="secondary" className="text-[10px] h-4 px-1 font-mono">
												{ipInfo.countryCode}
											</Badge>
										)}
									</div>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Postal Code</span>
									<span className="font-mono font-medium text-foreground">{ipInfo.postal || "N/A"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Continent</span>
									<span className="font-medium text-foreground">{ipInfo.continent || "Unknown"}</span>
								</div>
								{ipInfo.latitude && ipInfo.longitude && (
									<div className="flex justify-between py-1">
										<span className="text-muted-foreground">Coordinates</span>
										<span className="font-mono text-foreground">{ipInfo.latitude}, {ipInfo.longitude}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Network & Infrastructure Card */}
						<Card className="border-border/60 shadow-sm">
							<CardHeader className="py-3 px-4 border-b border-border/40">
								<CardTitle className="text-sm font-semibold flex items-center gap-2">
									<Wifi className="h-4 w-4 text-primary" />
									Network & Provider
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 space-y-2.5 text-xs">
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Internet Service Provider</span>
									<span className="font-medium text-foreground text-right max-w-[200px] truncate">{ipInfo.isp || "Unknown"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Autonomous System (ASN)</span>
									<span className="font-mono font-medium text-foreground">{ipInfo.asn || "N/A"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Timezone</span>
									<span className="font-medium text-foreground">{ipInfo.timezone || "Unknown"}</span>
								</div>
								<div className="flex justify-between py-1 border-b border-border/30">
									<span className="text-muted-foreground">Currency</span>
									<span className="font-medium text-foreground">{ipInfo.currency || "N/A"}</span>
								</div>
								<div className="flex justify-between py-1">
									<span className="text-muted-foreground">Language</span>
									<span className="font-medium text-foreground">{ipInfo.language || "N/A"}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<Card className="border-border/60 p-12 text-center">
					<Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
					<p className="text-sm text-muted-foreground mb-4">
						Ready to fetch your public IP address and geolocation details
					</p>
					<Button onClick={getIPLocation}>Get My IP Location</Button>
				</Card>
			)}
		</div>
	);
}
