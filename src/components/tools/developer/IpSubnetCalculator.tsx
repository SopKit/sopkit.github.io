"use client";

import { useState, useMemo } from "react";
import { Network, ShieldCheck, Copy, Check, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function IpSubnetCalculator() {
	const [ipAddress, setIpAddress] = useState<string>("192.168.1.100");
	const [cidr, setCidr] = useState<number>(24);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	// Helper to convert IP string to 32-bit int
	const ipToInt = (ip: string): number => {
		return (
			ip
				.split(".")
				.reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0) >>> 0
		);
	};

	// Helper to convert 32-bit int to IP string
	const intToIp = (int: number): string => {
		return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(".");
	};

	// Calculate subnet details
	const subnetData = useMemo(() => {
		// Validate IPv4
		const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
		const match = ipAddress.trim().match(ipPattern);

		if (!match) {
			return { isValid: false, error: "Please enter a valid IPv4 address (e.g. 192.168.1.1)" };
		}

		const octets = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseInt(match[4], 10)];
		if (octets.some((o) => o > 255 || o < 0)) {
			return { isValid: false, error: "Octets must be between 0 and 255." };
		}

		const ipInt = ipToInt(ipAddress.trim());
		const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
		const wildcardInt = ~maskInt >>> 0;

		const networkInt = (ipInt & maskInt) >>> 0;
		const broadcastInt = (networkInt | wildcardInt) >>> 0;

		const totalHosts = cidr === 32 ? 1 : Math.pow(2, 32 - cidr);
		const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

		const firstHostInt = cidr >= 31 ? networkInt : networkInt + 1;
		const lastHostInt = cidr >= 31 ? broadcastInt : broadcastInt - 1;

		const subnetMask = intToIp(maskInt);
		const wildcardMask = intToIp(wildcardInt);
		const networkAddress = intToIp(networkInt);
		const broadcastAddress = intToIp(broadcastInt);
		const firstUsableHost = intToIp(firstHostInt);
		const lastUsableHost = intToIp(lastHostInt);

		// Determine Class & Scope
		const firstOctet = octets[0];
		let ipClass = "Class A";
		if (firstOctet >= 128 && firstOctet <= 191) ipClass = "Class B";
		else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "Class C";
		else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "Class D (Multicast)";
		else if (firstOctet >= 240) ipClass = "Class E (Reserved)";

		let ipType = "Public Internet";
		if (
			firstOctet === 10 ||
			(firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
			(firstOctet === 192 && octets[1] === 168)
		) {
			ipType = "Private RFC 1918";
		} else if (firstOctet === 127) {
			ipType = "Loopback";
		}

		// Binary representation
		const ipBinary = octets.map((o) => o.toString(2).padStart(8, "0")).join(".");
		const maskBinary = [
			(maskInt >>> 24) & 255,
			(maskInt >>> 16) & 255,
			(maskInt >>> 8) & 255,
			maskInt & 255,
		]
			.map((o) => o.toString(2).padStart(8, "0"))
			.join(".");

		return {
			isValid: true,
			networkAddress,
			broadcastAddress,
			subnetMask,
			wildcardMask,
			firstUsableHost,
			lastUsableHost,
			totalHosts: totalHosts.toLocaleString(),
			usableHosts: usableHosts.toLocaleString(),
			cidrNotation: `/${cidr}`,
			ipClass,
			ipType,
			ipBinary,
			maskBinary,
		};
	}, [ipAddress, cidr]);

	const handleCopy = (text: string, key: string) => {
		navigator.clipboard.writeText(text);
		setCopiedKey(key);
		toast.success(`Copied ${text}`);
		setTimeout(() => setCopiedKey(null), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Subnet Calculation: Network bitmasks calculated locally without logging IP configurations.</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Input Form */}
				<div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-5">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
							<Network className="h-4 w-4" />
						</div>
						<h3 className="text-base font-bold text-foreground">Subnet Parameters</h3>
					</div>

					<div className="space-y-4 text-xs">
						<div className="space-y-1.5">
							<Label htmlFor="ip-input" className="font-semibold text-foreground">
								IP Address
							</Label>
							<Input
								id="ip-input"
								type="text"
								placeholder="e.g. 192.168.1.1"
								value={ipAddress}
								onChange={(e) => setIpAddress(e.target.value)}
								className="h-9 text-xs font-mono"
							/>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between font-semibold text-foreground">
								<Label htmlFor="cidr-select">CIDR Prefix</Label>
								<span className="text-blue-600 dark:text-blue-400 font-mono">/{cidr}</span>
							</div>
							<select
								id="cidr-select"
								value={cidr}
								onChange={(e) => setCidr(Number(e.target.value))}
								className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
							>
								{Array.from({ length: 33 }, (_, i) => 32 - i).map((c) => (
									<option key={c} value={c}>
										/{c} — {c === 0 ? "0.0.0.0" : intToIp((~0 << (32 - c)) >>> 0)}
									</option>
								))}
							</select>
						</div>

						{/* Quick Presets */}
						<div className="pt-2 space-y-2">
							<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Common Subnets</span>
							<div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
								{[8, 16, 24, 28, 29, 30, 31, 32].map((c) => (
									<Button
										key={c}
										type="button"
										variant={cidr === c ? "default" : "outline"}
										size="sm"
										onClick={() => setCidr(c)}
										className={`h-7 text-xs ${cidr === c ? "bg-blue-600 text-white" : "border-border/60"}`}
									>
										/{c}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Results Table */}
				<div className="lg:col-span-7 space-y-4">
					{subnetData.isValid ? (
						<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
							<div className="flex items-center justify-between border-b border-border/40 pb-3">
								<div className="flex items-center gap-2">
									<Activity className="h-4 w-4 text-emerald-500" />
									<h4 className="text-sm font-bold text-foreground">Calculated Network Range</h4>
								</div>
								<span className="text-xs font-semibold text-muted-foreground">{subnetData.ipType} • {subnetData.ipClass}</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Network ID</span>
									<div className="flex items-center justify-between font-mono font-bold text-foreground">
										<span>{subnetData.networkAddress}</span>
										<button type="button" onClick={() => handleCopy(subnetData.networkAddress!, "net")}>
											{copiedKey === "net" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-foreground" />}
										</button>
									</div>
								</div>

								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Broadcast IP</span>
									<div className="flex items-center justify-between font-mono font-bold text-foreground">
										<span>{subnetData.broadcastAddress}</span>
										<button type="button" onClick={() => handleCopy(subnetData.broadcastAddress!, "bcast")}>
											{copiedKey === "bcast" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-foreground" />}
										</button>
									</div>
								</div>

								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Usable Host Range</span>
									<div className="font-mono font-bold text-foreground text-[11px]">
										{subnetData.firstUsableHost} — {subnetData.lastUsableHost}
									</div>
								</div>

								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subnet Mask</span>
									<div className="flex items-center justify-between font-mono font-bold text-foreground">
										<span>{subnetData.subnetMask}</span>
										<button type="button" onClick={() => handleCopy(subnetData.subnetMask!, "mask")}>
											{copiedKey === "mask" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-foreground" />}
										</button>
									</div>
								</div>

								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Usable Hosts</span>
									<div className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
										{subnetData.usableHosts}
									</div>
								</div>

								<div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Wildcard Mask</span>
									<div className="font-mono font-bold text-foreground">
										{subnetData.wildcardMask}
									</div>
								</div>
							</div>

							{/* Binary Representation */}
							<div className="p-3 rounded-xl bg-muted/20 border border-border/30 font-mono text-[10px] space-y-1 text-muted-foreground">
								<div>IP Binary: <span className="text-foreground">{subnetData.ipBinary}</span></div>
								<div>Mask Binary: <span className="text-foreground">{subnetData.maskBinary}</span></div>
							</div>
						</div>
					) : (
						<div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">
							{subnetData.error}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
